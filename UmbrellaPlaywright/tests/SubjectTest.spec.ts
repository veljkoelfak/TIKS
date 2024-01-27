import { test, expect, chromium } from '@playwright/test';

test('GetValidSubject', async ({page}) => {
  await page.pause();
  await page.goto('');
  await page.getByRole('button', { name: 'Get Subject' }).click();
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('1');
  await page.getByRole('button', { name: 'Get Subject From Database' }).click();
  await expect(page.getByLabel('Subjects')).toContainText('Key : 1 First Name : Chris Last Name : Redfield Age : 25 years Height: 190 cm Weight: 100 kg Status : Alive');
  await page.close();
});

test('GetNonExistingSubject', async ({ page }) => {
  await page.pause();
  await page.goto('');
  await page.getByRole('button', { name: 'Get Subject' }).click();
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('25');
  await page.getByRole('button', { name: 'Get Subject From Database' }).click();
  await expect(page.getByLabel('Subjects')).toContainText('Error during GET, Subject with ID 25 does not exist');
  await page.close();
});

test('GetInvalidSubject', async ({ page }) => {
  await page.pause();
  await page.goto('');
  await page.getByRole('button', { name: 'Get Subject' }).click();
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('Chris');
  await page.getByRole('button', { name: 'Get Subject From Database' }).click();
  await expect(page.getByLabel('Subjects')).toContainText('Error during GET, please enter a valid ID number');
  await page.close();
});

test('PostExistingSubject', async ({ page }) => {
  await page.goto('');
  await page.getByRole('button', { name: 'Add Subject' }).click();
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('1');
  await page.locator('#firstInput').click();
  await page.locator('#firstInput').fill('Jill');
  await page.locator('#firstInput').press('Tab');
  await page.locator('#lastInput').fill('Redfield');
  await page.locator('#lastInput').press('Tab');
  await page.locator('#ageInput').fill('22');
  await page.locator('#heightInput').click();
  await page.locator('#heightInput').fill('165');
  await page.locator('#weightInput').click();
  await page.locator('#weightInput').fill('55');
  await page.locator('#statusDropdown').selectOption('Missing');
  await page.getByRole('button', { name: 'Add to Database' }).click();
  await expect(page.getByLabel('Subjects')).toContainText('Subject with ID 1 already exists, failure to POST');
});

test('PostInvalidSubject', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Add Subject' }).click();
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('Albert');
  await page.locator('#firstInput').click();
  await page.locator('#firstInput').fill('Wesker');
  await page.locator('#lastInput').click();
  await page.locator('#lastInput').fill('Wesker');
  await page.locator('#lastInput').press('Tab');
  await page.locator('#ageInput').fill('35');
  await page.locator('#heightInput').click();
  await page.locator('#heightInput').fill('185');
  await page.locator('#weightInput').click();
  await page.locator('#weightInput').fill('84');
  await page.locator('#statusDropdown').selectOption('Missing');
  await page.getByRole('button', { name: 'Add to Database' }).click();
  await expect(page.getByLabel('Subjects')).toContainText('Failure to POST Subject. Check input values');
});

test('PostValidSubject', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Add Subject' }).click();
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('4');
  await page.locator('#firstInput').click();
  await page.locator('#firstInput').fill('Albert');
  await page.locator('#firstInput').press('Tab');
  await page.locator('#lastInput').fill('Wesker');
  await page.locator('#lastInput').press('Tab');
  await page.locator('#ageInput').fill('35');
  await page.locator('#heightInput').click();
  await page.locator('#heightInput').fill('186');
  await page.locator('#weightInput').click();
  await page.locator('#weightInput').fill('95');
  await page.locator('#statusDropdown').selectOption('Missing');
  await page.getByRole('button', { name: 'Add to Database' }).click();
  await expect(page.getByLabel('Subjects')).toContainText('Succesfully entered Subject Albert Wesker');
});

test('PutSubjectInvalid', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Update Subject' }).click();
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('6');
  await page.locator('#firstInput').click();
  await page.locator('#firstInput').fill('Albert');
  await page.locator('#lastInput').click();
  await page.locator('#lastInput').fill('Wesker');
  await page.locator('#lastInput').press('Tab');
  await page.locator('#ageInput').fill('36');
  await page.locator('#heightInput').click();
  await page.locator('#heightInput').fill('195');
  await page.locator('#weightInput').click();
  await page.locator('#weightInput').fill('100');
  await page.locator('#statusDropdown').selectOption('Alive');
  await page.locator('div').filter({ hasText: /^Update Subject$/ }).getByRole('button').click();
  await expect(page.getByLabel('Subjects')).toContainText('Failure to PUT Subject. Subject doesn\'t exist');
});

test('PutSubjectValid', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Update Subject' }).click();
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('4');
  await page.locator('#firstInput').click();
  await page.locator('#firstInput').fill('Albert');
  await page.locator('#lastInput').click();
  await page.locator('#lastInput').fill('Wesker');
  await page.locator('#lastInput').press('Tab');
  await page.locator('#ageInput').fill('36');
  await page.locator('#heightInput').click();
  await page.locator('#heightInput').fill('195');
  await page.locator('#weightInput').click();
  await page.locator('#weightInput').fill('100');
  await page.locator('#statusDropdown').selectOption('Alive');
  await page.locator('div').filter({ hasText: /^Update Subject$/ }).getByRole('button').click();
  await expect(page.getByLabel('Subjects')).toContainText('Succesfully updated Subject Albert Wesker');
});

test('DeleteValidSubject', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Delete Subject' }).click();
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('100');
  await page.locator('div').filter({ hasText: /^Delete Subject$/ }).getByRole('button').click();
  await expect(page.getByLabel('Subjects')).toContainText('Sucessfully terminated Subject 100');
});

test('DeleteInvalidSubject', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('Sheva');
  await page.locator('div').filter({ hasText: /^Delete Subject$/ }).getByRole('button').click();
  await expect(page.getByLabel('Subjects')).toContainText('Error during DELETE, please enter a valid ID number');
});

test('DeleteNaNSubject', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('18');
  await page.locator('div').filter({ hasText: /^Delete Subject$/ }).getByRole('button').click();
  await expect(page.getByLabel('Subjects')).toContainText('Failure to DELETE Subject. Subject doesn\'t exist');
});