// Using Puppeteer for browser automation
const puppeteer = require('puppeteer');

// Set a long timeout for all tests
jest.setTimeout(120000);

describe('Registration Form Test', () => {
  // Test password mismatch validation
  test('should show error when passwords do not match', async () => {
    let browser = null;
    
    try {
      console.log('Starting test with Puppeteer...');
      
      // Launch a new browser instance - set headless: false to see the browser UI
      browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: null
      });
      
      console.log('Browser started');
      
      // Open a new page
      const page = await browser.newPage();
      
      // Navigate to the registration page
      await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });
      console.log('Navigated to registration page');
      
      // Wait for the form to load
      await page.waitForSelector('#name');
      
      // Fill out the form with mismatched passwords
      await page.type('#name', 'Test User');
      await page.type('#email', 'test@example.com');
      await page.type('#password', 'password123');
      await page.type('#confirmPassword', 'password456');
      
      console.log('Form filled out');
      
      // Submit the form
      await Promise.all([
        page.click('#registerBtn'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {})
      ]);
      
      console.log('Form submitted');
      
      // Wait for the error message
      await page.waitForSelector('#wrongConfPw', { timeout: 5000 });
      
      // Check the error message
      const errorText = await page.$eval('#wrongConfPw', el => el.textContent);
      console.log('Error message:', errorText);
      expect(errorText).toContain('Passwords do not match');
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-result.png' });
      console.log('Screenshot saved as test-result.png');
      
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    } finally {
      // Always close the browser
      if (browser) {
        console.log('Closing browser...');
        await browser.close();
        console.log('Browser closed');
      }
    }
  }, 60000); // 60 second timeout for this test

  // Test successful registration
  test('should register successfully with valid inputs', async () => {
    let browser = null;
    
    try {
      console.log('Starting successful registration test...');
      
      // Launch a new browser instance
      browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: null
      });
      
      // Open a new page
      const page = await browser.newPage();
      
      // Navigate to the registration page
      await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });
      console.log('Navigated to registration page');
      
      // Generate a unique email to avoid duplicate user errors
      const uniqueEmail = `test${Date.now()}@example.com`;
      
      // Fill out the form with valid data
      await page.type('#name', 'Test User');
      await page.type('#email', uniqueEmail);
      await page.type('#password', 'password123');
      await page.type('#confirmPassword', 'password123');
      
      console.log('Form filled out with valid data');
      
      // Take a screenshot before submission
      await page.screenshot({ path: 'before-submit.png' });
      
      // Submit the form and wait for navigation
      await Promise.all([
        page.click('#registerBtn'),
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 })
      ]);
      
      console.log('Form submitted, waiting for redirect');
      
      // Take a screenshot after submission
      await page.screenshot({ path: 'after-submit.png' });
      
      // Check if we're redirected to the landing page
      const currentUrl = page.url();
      console.log('Current URL after registration:', currentUrl);
      
      // Verify we're on the landing page (or home page)
      expect(currentUrl).toMatch(/http:\/\/localhost:3000\/?/);
      
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    } finally {
      // Always close the browser
      if (browser) {
        console.log('Closing browser...');
        await browser.close();
        console.log('Browser closed');
      }
    }
  }, 60000); // 60 second timeout for this test

  test('should Give error with duplicate email', async () => {
    let browser = null;
    
    try {
      console.log('Starting duplicate test...');
      
      // Launch a new browser instance
      browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: null
      });
      
      // Open a new page
      const page = await browser.newPage();
      
      // Navigate to the registration page
      await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });
      console.log('Navigated to registration page');
      
      // Generate a unique email to avoid duplicate user errors
      const Email = 'lithiramalkith@gmail.com';
      
      // Fill out the form with valid data
      await page.type('#name', 'Test User');
      await page.type('#email', Email);
      await page.type('#password', 'password123');
      await page.type('#confirmPassword', 'password123');
      
      console.log('Form filled out with Duplicate email');
      
      // Take a screenshot before submission
      await page.screenshot({ path: 'before-submit.png' });
      
      // Submit the form and wait for navigation
      await Promise.all([
        page.click('#registerBtn'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {})
      ]);
      
      console.log('Form submitted, waiting for redirect');
      
      await page.waitForSelector('#wrongConfPw', { timeout: 5000 });
      
      // Check the error message
      const errorText = await page.$eval('#wrongConfPw', el => el.textContent);
      console.log('Error message:', errorText);
      expect(errorText).toContain('Registration failed');
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-result.png' });
      console.log('Screenshot saved as test-result.png');
      
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    } finally {
      // Always close the browser
      if (browser) {
        console.log('Closing browser...');
        await browser.close();
        console.log('Browser closed');
      }
    }
  }, 60000); // 60 second time
});