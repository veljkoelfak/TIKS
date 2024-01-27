import { test, expect, chromium } from '@playwright/test';

  test('PostInvalidVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Create Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('4');
    await page.locator('#nameInput').click();
    await page.locator('#nameInput').fill('Progenitor');
    await page.locator('#nameInput').press('Tab');
    await page.locator('#typeinput').fill('Progenitor');
    await page.locator('#typeinput').press('Tab');
    await page.locator('#familyInput').fill('Progenitor');
    await page.locator('#familyInput').press('Tab');
    await page.locator('#descInput').fill('DO NOT LET IT OUT');
    await page.locator('#genInput').click();
    await page.locator('#genInput').fill('98742');
    await page.getByRole('button', { name: 'Add to Database' }).click();
    await expect(page.getByLabel('Viruses')).toContainText('Failure to POST Virus. Check input values');
  });

  test('PostValidVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Create Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('4');
    await page.locator('#nameInput').click();
    await page.locator('#nameInput').fill('Progenitor');
    await page.locator('#nameInput').press('Tab');
    await page.locator('#typeinput').fill('Progenitor');
    await page.locator('#typeinput').press('Tab');
    await page.locator('#familyInput').fill('Progenitor');
    await page.locator('#familyInput').press('Tab');
    await page.locator('#descInput').fill('DO NOT LET IT OUT');
    await page.locator('#genInput').click();
    await page.locator('#genInput').fill('98742');
    await page.locator('#statusDropdown').selectOption('High');
    await page.getByRole('button', { name: 'Add to Database' }).click();
    await expect(page.getByLabel('Viruses')).toContainText('Succesfully entered Virus Progenitor of type Progenitor');
  });
  test('PostExistingVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Create Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('4');
    await page.locator('#nameInput').click();
    await page.locator('#nameInput').fill('Progenitor');
    await page.locator('#nameInput').press('Tab');
    await page.locator('#typeinput').fill('Progenitor');
    await page.locator('#typeinput').press('Tab');
    await page.locator('#familyInput').fill('Progenitor');
    await page.locator('#familyInput').press('Tab');
    await page.locator('#descInput').fill('DO NOT LET IT OUT');
    await page.locator('#genInput').click();
    await page.locator('#genInput').fill('98742');
    await page.locator('#statusDropdown').selectOption('High');
    await page.getByRole('button', { name: 'Add to Database' }).click();
    await expect(page.getByLabel('Viruses')).toContainText('Virus with ID 4 already exists, failure to POST');
  });

  test('GetValidVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Get Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('2');
    await page.getByRole('button', { name: 'Get Virus From Database' }).click();
    await expect(page.getByLabel('Viruses')).toContainText('Key : 2 Name: G-Virus Type : Parasitic type Family : G genera Description: Undisclosed Lethality: High Gen Code : 9978441');
  });

  test('GetNaNVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Get Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('6');
    await page.getByRole('button', { name: 'Get Virus From Database' }).click();
    await expect(page.getByLabel('Viruses')).toContainText('Error during GET, Virus with ID 6 does not exist');
  });

  test('GetInvalidVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Get Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('Progenitor');
    await page.getByRole('button', { name: 'Get Virus From Database' }).click();
    await expect(page.getByLabel('Viruses')).toContainText('Error during GET, please enter a valid ID number');
  });

  test('PutInvalidVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Update Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('4');
    await page.locator('#nameInput').click();
    await page.locator('#nameInput').fill('Progenitor');
    await page.locator('#nameInput').press('Tab');
    await page.locator('#typeinput').fill('Progenitor');
    await page.locator('#typeinput').press('Tab');
    await page.locator('#familyInput').fill('Progenitor');
    await page.locator('#familyInput').press('Tab');
    await page.locator('#descInput').fill('IT GOT OUT');
    await page.locator('#genInput').click();
    await page.locator('#genInput').fill('98745');
    await page.locator('div').filter({ hasText: /^Update Virus$/ }).getByRole('button').click();
    await expect(page.getByLabel('Viruses')).toContainText('Failure to PUT Virus, New Gen Code smaller than 13');
  });

  test('PutValidVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Update Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('4');
    await page.locator('#nameInput').click();
    await page.locator('#nameInput').fill('Progenitor');
    await page.locator('#nameInput').press('Tab');
    await page.locator('#typeinput').fill('Progenitor');
    await page.locator('#typeinput').press('Tab');
    await page.locator('#familyInput').fill('Progenitor');
    await page.locator('#familyInput').press('Tab');
    await page.locator('#descInput').fill('IT GOT OUT');
    await page.locator('#genInput').click();
    await page.locator('#genInput').fill('98845');
    await page.locator('div').filter({ hasText: /^Update Virus$/ }).getByRole('button').click();
    await expect(page.getByLabel('Viruses')).toContainText('Succesfully updated Virus Progenitor of type Progenitor');
  });

  test('PutNaNVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Update Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('8');
    await page.locator('#nameInput').click();
    await page.locator('#nameInput').fill('Progenitor');
    await page.locator('#nameInput').press('Tab');
    await page.locator('#typeinput').fill('Progenitor');
    await page.locator('#typeinput').press('Tab');
    await page.locator('#familyInput').fill('Progenitor');
    await page.locator('#familyInput').press('Tab');
    await page.locator('#descInput').fill('IT GOT OUT');
    await page.locator('#genInput').click();
    await page.locator('#genInput').fill('98845');
    await page.locator('div').filter({ hasText: /^Update Virus$/ }).getByRole('button').click();
    await expect(page.getByLabel('Viruses')).toContainText('Failure to PUT Virus. Virus doesn\'t exist');
  });

  test('DeleteNaNVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Delete Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('9');
    await page.getByRole('button', { name: 'Delete Virus' }).click();
    await expect(page.getByLabel('Viruses')).toContainText('Failure to DELETE Virus. Virus doesn\'t exist');
  });

  test('DeleteInvalidVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Delete Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('Progenitor');
    await page.getByRole('button', { name: 'Delete Virus' }).click();
    await expect(page.getByLabel('Viruses')).toContainText('Error during DELETE, please enter a valid ID number');
  });

  test('DeleteValidVirus', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Viruses' }).click();
    await page.getByRole('button', { name: 'Delete Virus' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('Progenitor');
    await page.getByRole('button', { name: 'Delete Virus' }).click();
    await expect(page.getByLabel('Viruses')).toContainText('Error during DELETE, please enter a valid ID number');
  });


