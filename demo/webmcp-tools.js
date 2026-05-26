// Verification snippets for this file's tool: see ../VERIFY.md

(function () {
  const status = document.getElementById('webmcp-status');

  if (!('modelContext' in navigator) || typeof navigator.modelContext.registerTool !== 'function') {
    status.textContent = 'WebMCP not available in this browser — the form still works, but no tools are exposed.';
    status.classList.remove('status--pending');
    status.classList.add('status--missing');
    return;
  }

  const REFERRER_OPTIONS = [
    'Search engine',
    'Friend/Colleague recommendation',
    'Review or other article',
    'Advertisement',
    'Pressidium Blog',
    'Other',
  ];
  const PLAN_OPTIONS = [
    'Enterprise Plans',
    'Standard Plans',
    'I am not sure',
  ];
  const INDUSTRY_OPTIONS = [
    'Agency',
    'Business / Brand',
    'Woocommerce',
    'University / Higher-Ed',
    'LMS / e-Learning',
    'Other',
  ];
  const VISITS_OPTIONS = [
    '1.000.000', '1.500.000', '2.000.000', '3.000.000', '5.000.000', '10.000.000',
  ];
  const STORAGE_OPTIONS = [
    '120GB', '240GB', '480GB', '1T', '2T', '4T',
  ];

  navigator.modelContext.registerTool({
    name: 'contact_sales',
    title: 'Contact Pressidium Sales',
    description:
      'Send an inquiry to the Pressidium sales team about managed WordPress hosting. ' +
      'Use this tool when the user wants to reach out about plans, pricing, migration, ' +
      'or to schedule a sales call. Submits the form on the user\'s behalf.',
    inputSchema: {
      type: 'object',
      properties: {
        fullname:       { type: 'string',  description: 'The person\'s full name as they want it to appear on the inquiry.' },
        email:          { type: 'string',  format: 'email', description: 'Email address where the sales team should reply.' },
        phone:          { type: 'string',  description: 'Optional phone number, raw as the user wrote it. Country code is fine but not required.' },
        website:        { type: 'string',  description: 'URL of the website they currently run or want to migrate. Required.' },
        followup:       { type: 'boolean', description: 'True if the user wants the sales team to schedule a follow-up call. Default false.' },
        referrer:       { type: 'string',  enum: REFERRER_OPTIONS, description: 'How the user heard about Pressidium. Optional.' },
        plan:           { type: 'string',  enum: PLAN_OPTIONS,     description: 'Which Pressidium plan the user is interested in. Use "I am not sure" if unclear.' },
        industry:       { type: 'string',  enum: INDUSTRY_OPTIONS, description: 'The industry the user\'s site or business is in.' },
        visits:         { type: 'string',  enum: VISITS_OPTIONS,   description: 'Optional monthly visits threshold. Pick the closest match at or above the user\'s actual traffic.' },
        storage:        { type: 'string',  enum: STORAGE_OPTIONS,  description: 'Optional storage size. Pick the closest match at or above the user\'s actual needs.' },
        message:        { type: 'string',  description: 'Free-text description of the user\'s needs, in their own words. Pass through what they wrote — do not rephrase or summarise.' },
        privacyConsent: { type: 'boolean', description: 'Must be true. Confirms the user has read the Privacy Policy and consents to being contacted.' },
      },
      required: ['fullname', 'email', 'website', 'plan', 'industry', 'message', 'privacyConsent'],
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
    },
    execute: async (input) => {
      if (input.privacyConsent !== true) {
        return {
          ok: false,
          error: 'consent_required',
          message: 'Privacy Policy consent is required to submit this form. Ask the user to confirm before retrying.',
        };
      }

      const form = document.getElementById('sales-form-contact');
      for (const [key, value] of Object.entries(input)) {
        const el = form.elements[key];
        if (!el) continue;
        if (el.type === 'checkbox') el.checked = value === true;
        else if (value != null)     el.value   = value;
      }

      form.requestSubmit();

      return {
        ok: true,
        message: `Inquiry submitted for ${input.fullname}. The Pressidium Sales Engineering team will reply to ${input.email}.`,
      };
    },
  });

  status.textContent = 'WebMCP tool "contact_sales" registered ✓';
  status.classList.remove('status--pending');
  status.classList.add('status--ok');
})();
