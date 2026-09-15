export class RegexPattern {
  // Email with mandatory domain extension
  static readonly EMAIL =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Only alphabets and spaces
  static readonly ONLY_ALPHABETS =
    /^[a-zA-Z ]+$/;

  // Only numbers
  static readonly ONLY_NUMBERS =
    /^[0-9]+$/;

  // Alphanumeric
  static readonly ALPHANUMERIC =
    /^[a-zA-Z0-9]+$/;

  // Indian mobile number
  static readonly INDIAN_MOBILE =
    /^[6-9][0-9]{9}$/;
}
