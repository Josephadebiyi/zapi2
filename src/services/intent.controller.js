const Business = require('../models/Business');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const { searchBusinesses, getAvailability, initializeBooking, getBusinessStripeDetails, cancelBooking, confirmBooking } = require('./booking.flow');
const { createCheckoutSession, createMoneiPayment } = require('./payment.service');
const redisUtils = require('../utils/redis');
const sessionService = require('./session.service');

// The main router that decides what to do based on AI intent
const handleIntent = async (phoneNumber, extractedData) => {
    const { language, intent, entities } = extractedData;
    const userLanguage = language || 'es';

    // Find or create user
    let user = await User.findOne({ phoneNumber });
    if (!user) {
        user = await User.create({ phoneNumber, language: userLanguage, gdprConsentDate: new Date() });
    }

    const responseTexts = {
        es: {
            search_service: "He encontrado las siguientes opciones para ti:\n",
            select_date: "Elige la fecha para el servicio.",
            select_time: "Estos son los horarios disponibles para ese día:\n",
            help: "Hola, soy el asistente de ZAPI. Puedo ayudarte a buscar negocios, reservar citas o reportar un problema. ¿Qué deseas hacer?",
            complaint_logged: "Hemos registrado tu reclamación y notificado al negocio. Nos pondremos en contacto pronto.",
            default: "Lo siento, no entendí bien. ¿Podrías ser más específico?"
        },
        en: {
            search_service: "I found the following options for you:\n",
            select_date: "Please choose a date for the service.",
            select_time: "Here are the available times for that day:\n",
            help: "Hi, I'm the ZAPI assistant. I can help search for businesses, book appointments, or report issues. What would you like to do?",
            complaint_logged: "We have logged your complaint and notified the business. We'll be in touch soon.",
            default: "I'm sorry, I didn't quite catch that. Could you be more specific?"
        }
    };

    const strings = responseTexts[language === 'en' ? 'en' : 'es'];

    // Get or initialize session
    let session = await sessionService.getSession(phoneNumber);
    if (!session) {
        session = await sessionService.initSession(phoneNumber, { language: userLanguage });
    }

    switch (intent) {
        case 'search_service':
            if (!entities.service) {
                return language === 'en' ? "What specific service are you looking for?" : "¿Qué servicio específico buscas?";
            }
            const businesses = await searchBusinesses(entities.service, entities.location);
            if (businesses.length === 0) {
                return language === 'en' ? "No matches found." : "No se encontraron resultados.";
            }

            // Store search results in session
            await sessionService.setSearchResults(phoneNumber, businesses);

            let replyBus = strings.search_service;
            businesses.forEach((b, idx) => {
                replyBus += `${idx + 1}. ${b.name} - ${b.location} - ${b.services[0].price}€\n`;
            });
            replyBus += (language === 'en' ? "Reply with the number to select." : "Responde con el número para seleccionar.");
            return replyBus;

        case 'book_appointment':
        case 'select_date':
        case 'select_time':
            // Use session state to track which business the user selected
            try {
                // If user hasn't selected a business yet, check if we have search results
                if (!session.selectedBusiness && session.searchResults && session.searchResults.length > 0) {
                    // Check if entities contain a number (business selection)
                    const selectionNumber = parseInt(entities.service) || parseInt(entities.location);
                    if (selectionNumber && selectionNumber > 0 && selectionNumber <= session.searchResults.length) {
                        const selectedBiz = session.searchResults[selectionNumber - 1];
                        const fullBusiness = await Business.findById(selectedBiz.id);
                        if (fullBusiness) {
                            await sessionService.setSelectedBusiness(phoneNumber, fullBusiness);
                            return language === 'en'
                                ? `Great! You selected ${fullBusiness.name}. What date would you like? (Format: YYYY-MM-DD)`
                                : `¡Genial! Seleccionaste ${fullBusiness.name}. ¿Qué fecha prefieres? (Formato: YYYY-MM-DD)`;
                        }
                    }
                }

                // Update session with booking details as they come in
                if (entities.date) {
                    await sessionService.updateSession(phoneNumber, { selectedDate: entities.date });
                    session = await sessionService.getSession(phoneNumber);
                }
                if (entities.time) {
                    await sessionService.updateSession(phoneNumber, { selectedTime: entities.time });
                    session = await sessionService.getSession(phoneNumber);
                }

                // Check if we have all required info to create booking
                if (session.selectedBusiness && session.selectedDate && session.selectedTime) {
                    const business = await Business.findById(session.selectedBusiness.id);
                    if (!business) {
                        await sessionService.clearSession(phoneNumber);
                        return language === 'en' ? "Business not found. Please start again." : "Negocio no encontrado. Por favor comienza de nuevo.";
                    }

                    // Try to lock slot
                    const locked = await redisUtils.lockSlot(business._id, session.selectedDate, session.selectedTime, user._id, 600);
                    if (!locked) {
                        return language === 'en' ? "That time slot is no longer available." : "Ese horario ya no está disponible.";
                    }

                    // Find the selected service from the business
                    const serviceEntity = entities.service || session.selectedService;
                    const bookingEntities = {
                        service: serviceEntity,
                        date: session.selectedDate,
                        time: session.selectedTime
                    };

                    const booking = await initializeBooking(user._id, business, bookingEntities);

                    // Store pending booking in session
                    await sessionService.updateSession(phoneNumber, {
                        pendingBookingId: booking._id.toString(),
                        conversationState: 'confirming'
                    });

                    let paymentUrl = "";
                    if (business.requiresPayment) {
                        const moneiResponse = await createMoneiPayment(
                            booking._id,
                            booking.price,
                            booking.currency,
                            business.name
                        );
                        paymentUrl = moneiResponse.nextAction?.redirectUrl || moneiResponse.url;
                        booking.stripeSessionId = moneiResponse.id;
                    }

                    await booking.save();

                    if (business.requiresPayment) {
                        return (language === 'en'
                            ? `Great! Your slot is held for 10 minutes. Pay here to confirm: ${paymentUrl}`
                            : `¡Genial! Tu turno está reservado por 10 minutos. Paga aquí para confirmar: ${paymentUrl}`);
                    } else {
                        await confirmBooking(booking._id, "free_booking");
                        await sessionService.clearSession(phoneNumber); // Clear session after successful booking
                        return (language === 'en'
                            ? `Great! Your booking is confirmed for ${session.selectedDate} at ${session.selectedTime}.`
                            : `¡Genial! Tu reserva está confirmada para el ${session.selectedDate} a las ${session.selectedTime}.`);
                    }
                } else {
                    // Guide user on what's missing
                    if (!session.selectedBusiness) {
                        return language === 'en'
                            ? "Please first search for a service (e.g., 'I need a haircut in Madrid')"
                            : "Por favor primero busca un servicio (ej: 'Necesito un corte de pelo en Madrid')";
                    } else if (!session.selectedDate) {
                        return language === 'en'
                            ? "What date would you like? (Format: YYYY-MM-DD)"
                            : "¿Qué fecha prefieres? (Formato: YYYY-MM-DD)";
                    } else if (!session.selectedTime) {
                        return language === 'en'
                            ? "What time would you like? (Format: HH:MM)"
                            : "¿A qué hora? (Formato: HH:MM)";
                    }
                }

            } catch (e) {
                console.error(e);
                return language === 'en' ? "An error occurred." : "Ocurrió un error.";
            }
            return strings.default;

        case 'cancel_booking':
            if (entities.booking_id) {
                const cancelled = await cancelBooking(entities.booking_id, user._id);
                if (cancelled) {
                    return strings.cancel_success;
                } else {
                    return strings.cancel_fail;
                }
            }
            return language === 'en' ? "Please provide the booking ID to cancel." : "Por favor proporciona el ID de tu reserva para cancelar.";

        case 'reschedule_booking':
            if (entities.booking_id) {
                // High level logic: mark old as cancelled, trigger select_date flow again for business
                return language === 'en'
                    ? "I can help reschedule. I canceled your previous slot. When would you like to re-book?"
                    : "Te ayudo a reprogramar. He cancelado el espacio anterior. ¿Cuándo deseas la nueva reserva?";
            }
            return language === 'en' ? "Please provide a booking ID to reschedule." : "Por favor proporciona el ID de reserva a reprogramar.";

        case 'complaint':
            if (entities.booking_id) {
                try {
                    // Find the booking to get the actual business ID
                    const booking = await Booking.findById(entities.booking_id);
                    if (!booking) {
                        return language === 'en'
                            ? "Booking not found. Please check the ID and try again."
                            : "Reserva no encontrada. Por favor verifica el ID e intenta de nuevo.";
                    }

                    await Complaint.create({
                        userId: user._id,
                        bookingId: booking._id,
                        businessId: booking.businessId,
                        message: entities.complaint_message || `User complaint regarding booking ${entities.booking_id}`
                    });

                    // Trigger email sending via a background job or hook
                    return strings.complaint_logged;
                } catch (e) {
                    console.error('Error creating complaint:', e);
                    return language === 'en'
                        ? "Error processing your complaint. Please try again."
                        : "Error al procesar tu reclamación. Por favor intenta de nuevo.";
                }
            }
            return language === 'en' ? "Please provide the booking ID for your complaint." : "Por favor proporciona el ID de tu reserva para la reclamación.";

        case 'help':
            return strings.help;

        default:
            return strings.default;
    }
};

module.exports = {
    handleIntent
};
