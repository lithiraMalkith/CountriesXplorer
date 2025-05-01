import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

// Get all countries
export const getAllCountries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all countries:', error);
    throw error;
  }
};

// Search countries by name
export const getCountriesByName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching for country "${name}":`, error);
    return [];
  }
};

// Get countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${BASE_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries in region "${region}":`, error);
    throw error;
  }
};

// Get country by code (alpha)
export const getCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${BASE_URL}/alpha/${code}`);
    return response.data[0];
  } catch (error) {
    console.error(`Error fetching country with code "${code}":`, error);
    throw error;
  }
};

// Get countries by language
export const getCountriesByLanguage = async (language) => {
  try {
    // First get all countries
    const allCountries = await getAllCountries();
    
    // Then filter by language
    return allCountries.filter(country => {
      if (country.languages) {
        return Object.values(country.languages)
          .some(lang => lang.toLowerCase().includes(language.toLowerCase()));
      }
      return false;
    });
  } catch (error) {
    console.error(`Error fetching countries with language "${language}":`, error);
    throw error;
  }
};
