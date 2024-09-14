export const serverUrl = process.env.REACT_APP_DEV_MODE
  ? process.env.REACT_APP_DEV_MODE
  : process.env.REACT_APP_PRO_MODE;


function extractCountryCode(input) {
  const codeMatch = input.match(/\+\d+/);
  return codeMatch ? codeMatch[0] : null;
}

function extractCountryName(input) {
  const nameMatch = input.match(/\(([^)]+)\)/);
  return nameMatch ? nameMatch[1] : null;
}

// Extract Code and countryName

export const extractCodeAndCountryNameFromLabel = (label) => {
  const countryCode = extractCountryCode(label);
  const countryName = extractCountryName(label);

  return { countryCode, countryName };
};


export function extractCountryNameFromProfileMobile(input) {
  const nameMatch = input.match(/^(.+?) \(\+\d+\)/);
  return nameMatch ? nameMatch[1].trim() : null;
}

export function extractCountryCodeFromProfileMobile(input) {
  const codeMatch = input.match(/\+\d+/);
  return codeMatch ? codeMatch[0] : null;
}

export function extractMobileNumberFromProfileMobile(input) {
  const numberMatch = input.match(/\(\+\d+\)\s*(\d+)/);
  return numberMatch ? numberMatch[1] : null;
}