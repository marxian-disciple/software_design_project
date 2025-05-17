// ------------------- Validation Functions -------------------
function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function isPhoneValid(phone) {
  const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
  return phoneRegex.test(phone.trim());
}

function areRequiredFieldsFilled({ businessName, fullName, email, phone }) {
  return businessName.trim() !== '' && fullName.trim() !== '' && email.trim() !== '' && phone.trim() !== '';
}

// ------------------- Test Data -------------------
const testCases = [
  {
    input: {
      businessName: "Handmade & Co",
      fullName: "Zanele Mokoena",
      email: "zanele@example.com",
      phone: "0812345678"
    },
    expected: {
      required: true,
      email: true,
      phone: true
    }
  },
  {
    input: {
      businessName: "",
      fullName: "Lebo Molefe",
      email: "lebo@example.com",
      phone: "+27812345678"
    },
    expected: {
      required: false,
      email: true,
      phone: true
    }
  },
  {
    input: {
      businessName: "Crafty Vibes",
      fullName: "Kamo Ndlovu",
      email: "kamogmail.com",
      phone: "0823456789"
    },
    expected: {
      required: true,
      email: false,
      phone: true
    }
  },
  {
    input: {
      businessName: "Artiful Living",
      fullName: "Neo Khumalo",
      email: "neo@art.co.za",
      phone: "0123456789"
    },
    expected: {
      required: true,
      email: true,
      phone: false
    }
  }
];

// ------------------- Run Tests -------------------
testCases.forEach((test, index) => {
  const { input, expected } = test;
  const results = {
    required: areRequiredFieldsFilled(input),
    email: isEmailValid(input.email),
    phone: isPhoneValid(input.phone)
  };

  console.log(`Test Case ${index + 1}`);
  console.log(`Input:`, input);
  console.log(`Expected:`, expected);
  console.log(`Actual:`, results);
  console.log(
    results.required === expected.required &&
    results.email === expected.email &&
    results.phone === expected.phone
      ? '✅ Passed\n'
      : '❌ Failed\n'
  );
});
