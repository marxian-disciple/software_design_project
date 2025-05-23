/**
 * @jest-environment jsdom
 */

import {
  renderProfiles,
  renderNotLoggedIn,
  renderError,
  initCloseButton
} from '../local_artisan/scripts/alter_shop.js';

describe('profileHandlers', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = `<div id="root"></div>`;
    container = document.getElementById('root');
    global.initializeShopUpdate = jest.fn(); // mock dependency
  });

  test('renderProfiles appends profile form for matching user', () => {
    const user = { uid: 'abc123', email: 'user@example.com' };
    const docs = [{
      data: () => ({
        userId: 'abc123',
        businessName: 'My Biz',
        fullName: 'Jane Doe',
        email: 'biz@example.com',
        phone: '0123456789',
        vatNumber: 'VAT123',
        website: 'www.biz.com'
      })
    }];

    renderProfiles(container, docs, user);

    const form = container.querySelector('.shop-info');
    expect(form).not.toBeNull();
    expect(form.querySelector('#businessName').placeholder).toBe('My Biz');
    expect(form.querySelector('#owner').placeholder).toBe('Jane Doe');
    expect(form.querySelector('#email').placeholder).toBe('biz@example.com');
    expect(global.initializeShopUpdate).toHaveBeenCalled();
  });

  test('renderProfiles does not render form for non-matching user', () => {
    const user = { uid: 'not-matching' };
    const docs = [{
      data: () => ({
        userId: 'other-id',
        businessName: 'Their Biz'
      })
    }];

    renderProfiles(container, docs, user);
    expect(container.querySelector('.shop-info')).toBeNull();
  });

  test('renderNotLoggedIn renders correct message', () => {
    renderNotLoggedIn(container);
    expect(container.innerHTML).toContain('You must be logged in');
  });

  test('renderError renders correct message', () => {
    renderError(container);
    expect(container.innerHTML).toContain('Failed to load shop profile');
  });

  test('initCloseButton adds event listener and triggers callback', () => {
    const callback = jest.fn();
    const closeBtn = document.createElement('button');
    closeBtn.id = 'closeBtn';
    document.body.appendChild(closeBtn);

    initCloseButton(callback);
    closeBtn.click();
    expect(callback).toHaveBeenCalled();
  });

  test('initCloseButton does not fail if button is missing', () => {
    expect(() => initCloseButton(() => {})).not.toThrow();
  });
});
