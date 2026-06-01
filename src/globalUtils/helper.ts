import { LaundryService } from "globalTypes/realm/laundry.types";

export function capitalizeWords(str: string) {
  if (typeof str !== "string") {
    throw new TypeError("Input must be a string");
  }

  return str
    .toLowerCase()
    .split(" ")
    .map(word => {
      // Handle empty strings from multiple spaces
      if (word.length === 0) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export const checkIsDeliveryService = (service: LaundryService) =>
  service === 'pickup and delivery' || service === 'pickup only';
