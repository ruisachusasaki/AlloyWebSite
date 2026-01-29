import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";
import { chatStorage, type IChatStorage } from "./replit_integrations/chat/storage";
import { bookingStorage, type IBookingStorage } from "./bookingStorage";

export interface IStorage extends IAuthStorage, IChatStorage, IBookingStorage {}

export class Storage implements IStorage {
  // Auth methods
  getUser = authStorage.getUser;
  upsertUser = authStorage.upsertUser;

  // Chat methods
  getConversation = chatStorage.getConversation;
  getAllConversations = chatStorage.getAllConversations;
  createConversation = chatStorage.createConversation;
  deleteConversation = chatStorage.deleteConversation;
  getMessagesByConversation = chatStorage.getMessagesByConversation;
  createMessage = chatStorage.createMessage;

  // Booking methods
  createBooking = bookingStorage.createBooking;
  updateBookingWithEvent = bookingStorage.updateBookingWithEvent;
  getBookingById = bookingStorage.getBookingById;
  getAllBookings = bookingStorage.getAllBookings;
  getBookingsByDateRange = bookingStorage.getBookingsByDateRange;
}

export const storage = new Storage();
