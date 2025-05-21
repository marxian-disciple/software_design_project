/**
 * @jest-environment jsdom
 */
import {
  renderProfiles,
  renderNotLoggedIn,
  renderError,
  initCloseButton
} from './../local_artisan/scripts/user_info.js';

describe('profileHandlers', () => {
  let container;

  beforeEach(() => {
    // each test gets a fresh container
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('renderNotLoggedIn', () => {
    test('displays the not-logged-in message', () => {
      renderNotLoggedIn(container);
      expect(container.innerHTML).toBe(
        '<p>You must be logged in to view this page.</p>'
      );
    });
  });

  describe('renderError', () => {
    test('displays the error message', () => {
      renderError(container);
      expect(container.innerHTML).toBe(
        '<p>Failed to load user profile.</p>'
      );
    });
  });

  describe('renderProfiles', () => {
    const makeDoc = data => ({ data: () => data });
    const user = { uid: 'user-123', email: 'u@example.com', displayName: 'U' };

    test('renders full profile for matching seller doc', () => {
      const fakeDocs = [
        makeDoc({
          userId: 'user-123',
          fullName: 'Alice',
          businessName: 'Alice Co',
          createdAt: { toDate: () => new Date('2020-01-01T12:00:00Z') },
          email: 'a@co.com',
          registrationNumber: 'REG-1',
          phone: '555-1234',
          vatNumber: 'VAT-42',
          website: 'https://alice.co'
        })
      ];

      renderProfiles(container, fakeDocs, user);
      const html = container.innerHTML;

      // It should include each field we passed in:
      expect(html).toContain('My Full Name: Alice');
      expect(html).toContain('My Business Name:</strong> Alice Co');
    expect(html).toContain('Created At:</strong> 2020/01/01, 14:00:00');
      expect(html).toContain('My Email:</strong> a@co.com');
      expect(html).toContain('My Registration Number:</strong> REG-1');
      expect(html).toContain('My Phone:</strong> 555-1234');
      expect(html).toContain('My UserID:</strong> user-123');
      expect(html).toContain('My VAT Number:</strong> VAT-42');
      expect(html).toContain('My Business Website:</strong> https://alice.co');
    });

    test('falls back when no docs match user.uid', () => {
      // docs with different userId
      const fakeDocs = [
        makeDoc({ userId: 'other-uid', fullName: 'X' })
      ];
      renderProfiles(container, fakeDocs, user);

      expect(container.innerHTML).toContain(
        '<strong>User Name: U</strong>'
      );
      expect(container.innerHTML).toContain(
        '<strong>Email:</strong> u@example.com'
      );
    });

    test('falls back when docs array is empty', () => {
      renderProfiles(container, [], user);
      expect(container.innerHTML).toContain(
        '<strong>User Name: U</strong>'
      );
      expect(container.innerHTML).toContain(
        '<strong>Email:</strong> u@example.com'
      );
    });

    test('uses email if displayName missing', () => {
      const anonUser = { uid: 'u1', email: 'e@e.com' };
      renderProfiles(container, [], anonUser);
      expect(container.innerHTML).toContain(
        '<strong>User Name: No display name</strong>'
      );
      expect(container.innerHTML).toContain(
        '<strong>Email:</strong> e@e.com'
      );
    });
  });

  describe('initCloseButton', () => {
    test('wires click handler when #closeBtn exists', () => {
      const btn = document.createElement('button');
      btn.id = 'closeBtn';
      container.appendChild(btn);

      const cb = jest.fn();
      initCloseButton(cb);

      btn.click();
      expect(cb).toHaveBeenCalled();
    });

    test('does nothing when #closeBtn is missing', () => {
      // no button in DOM
      const cb = jest.fn();
      expect(() => initCloseButton(cb)).not.toThrow();
      // nothing to click
      expect(cb).not.toHaveBeenCalled();
    });
  });
});
