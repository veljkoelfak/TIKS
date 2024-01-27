import { test, expect, chromium } from '@playwright/test';

test('PostInvalidVirusExp', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Experiments' }).click();
    await page.getByRole('button', { name: 'Conduct Experiment' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('6');
    await page.locator('#virusIDInput').click();
    await page.locator('#virusIDInput').fill('10');
    await page.locator('#subjectIDInput').click();
    await page.locator('#subjectIDInput').fill('2');
    await page.locator('#descInput').click();
    await page.locator('#descInput').fill('First virus conducted');
    await page.locator('#outcomeInput').click();
    await page.locator('#outcomeInput').fill('Fatal');
    await page.locator('#notesInput').click();
    await page.locator('#notesInput').fill('Needs more security');
    await page.getByRole('button', { name: 'Add to Database' }).click();
    await expect(page.getByLabel('Experiments')).toContainText('Virus with ID 10 doesn\'t exist, failure to POST');
  });

  test('PostInvalidSubjectExp', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Experiments' }).click();
    await page.getByRole('button', { name: 'Conduct Experiment' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('6');
    await page.locator('#virusIDInput').click();
    await page.locator('#virusIDInput').fill('1');
    await page.locator('#subjectIDInput').click();
    await page.locator('#subjectIDInput').fill('20');
    await page.locator('#descInput').click();
    await page.locator('#descInput').fill('First virus conducted');
    await page.locator('#outcomeInput').click();
    await page.locator('#outcomeInput').fill('Fatal');
    await page.locator('#notesInput').click();
    await page.locator('#notesInput').fill('Needs more security');
    await page.getByRole('button', { name: 'Add to Database' }).click();
    await expect(page.getByLabel('Experiments')).toContainText('Subject with ID 10 doesn\'t exist, failure to POST');
  });

  test('PostValidExp', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Experiments' }).click();
    await page.getByRole('button', { name: 'Conduct Experiment' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('6');
    await page.locator('#virusIDInput').click();
    await page.locator('#virusIDInput').fill('1');
    await page.locator('#subjectIDInput').click();
    await page.locator('#subjectIDInput').fill('2');
    await page.locator('#descInput').click();
    await page.locator('#descInput').fill('First virus conducted');
    await page.locator('#outcomeInput').click();
    await page.locator('#outcomeInput').fill('Fatal');
    await page.locator('#notesInput').click();
    await page.locator('#notesInput').fill('Needs more security');
    await page.getByRole('button', { name: 'Add to Database' }).click();
    await expect(page.getByLabel('Experiments')).toContainText('Succesfully entered Experiment with Subject 2 and Virus 1');
  });

  test('GetValidExp', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Experiments' }).click();
    await page.getByRole('button', { name: 'Get Experiment' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('1');
    await page.getByRole('button', { name: 'Get Experiment From Database' }).click();
    await expect(page.getByLabel('Experiments')).toContainText('Key : 1 Virus ID: 1 Virus Name : T-Virus Subject ID : 1 Subject First Name: Chris Subject Last Name: Redfield Description : Attempt to implant T-Virus Outcome : Subject escaped Notes : Find Chris Redfield');
  });

  test('GetNanExp', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Experiments' }).click();
    await page.getByRole('button', { name: 'Get Experiment' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('12');
    await page.getByRole('button', { name: 'Get Experiment From Database' }).click();
    await expect(page.getByLabel('Experiments')).toContainText('Error during GET, Experiment with ID 12 does not exist');
  });

  test('GetInvalidExp', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Experiments' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('Aaaaaa');
    await page.getByRole('button', { name: 'Get Experiment From Database' }).click();
    await expect(page.getByLabel('Experiments')).toContainText('Error during GET, please enter a valid ID number');
  });

  test('PutInvalidVirusExp', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Experiments' }).click();
    await page.getByRole('button', { name: 'Update Experiment' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('1');
    await page.locator('#virusIDInput').click();
    await page.locator('#virusIDInput').fill('10');
    await page.locator('#subjectIDInput').click();
    await page.locator('#subjectIDInput').fill('1');
    await page.locator('#descInput').click();
    await page.locator('#descInput').fill('Attempt to implant T-Virus');
    await page.locator('#descInput').press('Tab');
    await page.locator('#outcomeInput').fill('Subject escaped');
    await page.locator('#outcomeInput').press('Tab');
    await page.locator('#notesInput').fill('Subject still MIA');
    await page.getByRole('button', { name: 'Update Experiment' }).click();
    await expect(page.getByLabel('Experiments')).toContainText('Virus with ID 10 doesn\'t exist, failure to POST');
  });

test('PutInvalidIDExp', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('tab', { name: 'Experiments' }).click();
  await page.getByRole('button', { name: 'Update Experiment' }).click();
  await page.locator('#idInput').click();
  await page.locator('#idInput').fill('1');
  await page.locator('#virusIDInput').click();
  await page.locator('#virusIDInput').fill('1');
  await page.locator('#subjectIDInput').click();
  await page.locator('#subjectIDInput').fill('10');
  await page.locator('#descInput').click();
  await page.locator('#descInput').fill('Attempt to implant T-Virus');
  await page.locator('#descInput').press('Tab');
  await page.locator('#outcomeInput').fill('Subject escaped');
  await page.locator('#outcomeInput').press('Tab');
  await page.locator('#notesInput').fill('Subject still MIA');
  await page.getByRole('button', { name: 'Update Experiment' }).click();
  await expect(page.getByLabel('Experiments')).toContainText('Experiment with ID 10 doesn\'t exists, failure to POST');
});

test('PutValidExp', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Experiments' }).click();
    await page.getByRole('button', { name: 'Update Experiment' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('1');
    await page.locator('#virusIDInput').click();
    await page.locator('#virusIDInput').fill('1');
    await page.locator('#subjectIDInput').click();
    await page.locator('#subjectIDInput').fill('1');
    await page.locator('#descInput').click();
    await page.locator('#descInput').fill('Attempt to implant T-Virus');
    await page.locator('#descInput').press('Tab');
    await page.locator('#outcomeInput').fill('Subject escaped');
    await page.locator('#outcomeInput').press('Tab');
    await page.locator('#notesInput').fill('Subject still MIA');
    await page.getByRole('button', { name: 'Update Experiment' }).click();
    await expect(page.getByLabel('Experiments')).toContainText('Succesfully updated Experiment 1');
  });

  test('DeleteNanExp', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Experiments' }).click();
    await page.getByRole('button', { name: 'Delete Experiment' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('20');
    await page.getByRole('button', { name: 'Classify Experiment' }).click();
    await expect(page.getByLabel('Experiments')).toContainText('Failure to DELETE Experiment. Experiment doesn\'t exist');
  });

  test('DeleteInvalidExp', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Experiments' }).click();
    await page.getByRole('button', { name: 'Delete Experiment' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('First');
    await page.getByRole('button', { name: 'Classify Experiment' }).click();
    await expect(page.getByLabel('Experiments')).toContainText('Error during DELETE, please enter a valid ID number');
  });

  test('DeleteValidExp', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('tab', { name: 'Experiments' }).click();
    await page.getByRole('button', { name: 'Delete Experiment' }).click();
    await page.locator('#idInput').click();
    await page.locator('#idInput').fill('2');
    await page.getByRole('button', { name: 'Classify Experiment' }).click();
    await expect(page.getByLabel('Experiments')).toContainText('Sucessfully classified Experiment 2');
  });