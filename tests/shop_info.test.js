/**
 * @jest-environment jsdom
 */

import {
  renderProfiles,
  renderNotLoggedIn,
  renderError,
  initCloseButton,
} from '../local_artisan/scripts/shop_info';  // Adjust path accordingly

describe('profileHandlers', () => {
  let container;
  const user = { uid: 'user123', email: 'user@example.com' };

  beforeEach(() => {
    document.body.innerHTML = `<div id="container"></div><button id="closeBtn">Close</button>`;
    container = document.getElementById('container');
  });

  describe('renderProfiles', () => {
    test('renders profile section for docs matching user.uid', () => {
      const mockDate = new Date('2023-01-01T12:00:00Z');
      const docs = [
        {
          data: () => ({
            userId: 'user123',
            businessName: 'Test Business',
            createdAt: { toDate: () => mockDate },
            email: 'biz@example.com',
            registrationNumber: 'REG123',
            phone: '1234567890',
            vatNumber: 'VAT123',
            website: 'https://test.com',
          }),
        },
        {
          data: () => ({
            userId: 'otherUser',
            businessName: 'Other Business',
          }),
        },
      ];

      renderProfiles(container, docs, user);

      expect(container.querySelector('section.info')).not.toBeNull();
      expect(container.textContent).toContain('Test Business');
      expect(container.textContent).toContain('2023-01-01');  // date formatted
      expect(container.textContent).toContain('biz@example.com');
      expect(container.textContent).toContain('REG123');
      expect(container.textContent).toContain('1234567890');
      expect(container.textContent).toContain('VAT123');
      expect(container.textContent).toContain('https://test.com');

      // Should not include otherUser data
      expect(container.textContent).not.toContain('Other Business');
    });

    test('renders with fallback values when some fields missing', () => {
      const docs = [
        {
          data: () => ({
            userId: 'user123',
            // no businessName, createdAt, email, etc.
          }),
        },
      ];

      renderProfiles(container, docs, user);

      expect(container.textContent).toContain('My Business Name: N/A');
      expect(container.textContent).toContain('Created At: N/A');
      // Should fallback to user email if no email in data
      expect(container.textContent).toContain(user.email);
      expect(container.textContent).toContain('My Registration Number: N/A');
      expect(container.textContent).toContain('My Phone: N/A');
      expect(container.textContent).toContain('My VAT Number: N/A');
      expect(container.textContent).toContain('My Business Website: N/A');
    });

    test('renders nothing if no matching userId', () => {
      const docs = [
        { data: () => ({ userId: 'otherUser' }) },
      ];
      renderProfiles(container, docs, user);
      expect(container.innerHTML).toBe('');
    });
  });

  describe('renderNotLoggedIn', () => {
    test('sets container innerHTML with login message', () => {
      renderNotLoggedIn(container);
      expect(container.innerHTML).toBe('<p>You must be logged in to view this page.</p>');
    });
  });

  describe('renderError', () => {
    test('sets container innerHTML with error message', () => {
      renderError(container);
      expect(container.innerHTML).toBe('<p>Failed to load shop information.</p>');
    });
  });

  describe('initCloseButton', () => {
    test('adds click listener that calls onClose', () => {
      const onClose = jest.fn();
      initCloseButton(onClose);

      const btn = document.getElementById('closeBtn');
      btn.click();

      expect(onClose).toHaveBeenCalled();
    });

    test('does nothing if closeBtn not in DOM', () => {
      document.body.innerHTML = ''; // remove closeBtn
      const onClose = jest.fn();
      expect(() => initCloseButton(onClose)).not.toThrow();
    });
  });
});
