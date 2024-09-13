export function getWelcomeMessage() {
  const currentHour = new Date().getHours();
  let message;

  if (currentHour < 12) {
    message = "Good Morning";
  } else if (currentHour < 18) {
    message = "Good Afternoon";
  } else if (currentHour < 21) {
    message = "Good Evening";
  } else {
    message = "Good Night";
  }

  return message;
}

