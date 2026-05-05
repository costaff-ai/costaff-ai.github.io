/**
 * CoStaff — Coming Soon Early Access Form Generator
 * =================================================
 *
 * Google Apps Script that programmatically creates the early-access
 * Google Form referenced by the Coming Soon landing page
 * (https://costaff-ai.github.io/).
 *
 * USAGE
 * -----
 *  1. Go to https://script.google.com/ and create a new project.
 *  2. Replace the boilerplate Code.gs with this entire file.
 *  3. Update NOTIFY_EMAIL below if you want submission notifications
 *     sent somewhere other than the default address.
 *  4. From the menu, run `createCoStaffEarlyAccessForm`.
 *  5. Authorize the script when prompted (it needs Forms + Drive +
 *     Gmail scopes).
 *  6. Open View -> Logs (or the new Execution log). You will see:
 *       - Edit URL    (only you should use this)
 *       - Published URL  (paste this into the website)
 *       - Short URL   (forms.gle/xxxx — recommended for the site)
 *  7. Copy the short URL and run the project's swap helper:
 *
 *       cd <repo>
 *       git checkout coming-soon
 *       sed -i '' 's|https://forms.gle/REPLACE-WITH-GOOGLE-FORM-ID|<your form short url>|g' \
 *           index.html index.zh.html agents.html agents.zh.html
 *       git commit -am "wire up Google Form URL" && git push
 *
 *  8. (Optional) Run `setupEmailNotification` once to receive an
 *     email each time someone signs up.
 *
 * RE-RUNNING
 * ----------
 *  Each run of `createCoStaffEarlyAccessForm` creates a NEW form.
 *  Keep only one in production. Delete extras from your Drive.
 */

// ---- Config ----
const FORM_TITLE = 'CoStaff 搶先預約 / Early Access Signup';
const FORM_INTRO =
  '感謝你對 CoStaff 的興趣！正式上線後，我們會優先通知你。\n\n' +
  'Thanks for your interest in CoStaff. We will notify the early-access list first when we launch.';
const CONFIRMATION_MESSAGE =
  '預約成功！我們會在 CoStaff 正式上線時聯繫你。\n\n' +
  'You are on the list. We will be in touch when CoStaff launches.';
const NOTIFY_EMAIL = 'simonliuyuwei@gmail.com';

/**
 * Main entry point — creates the early-access Google Form.
 */
function createCoStaffEarlyAccessForm() {
  const form = FormApp.create(FORM_TITLE);

  form
    .setTitle(FORM_TITLE)
    .setDescription(FORM_INTRO)
    .setCollectEmail(true)
    .setLimitOneResponsePerUser(false)
    .setShowLinkToRespondAgain(false)
    .setProgressBar(true)
    .setConfirmationMessage(CONFIRMATION_MESSAGE);

  // 1. Name
  form
    .addTextItem()
    .setTitle('稱呼 / Name')
    .setRequired(true);

  // 2. Use Case
  form
    .addMultipleChoiceItem()
    .setTitle('使用情境 / Use Case')
    .setChoiceValues([
      '個人使用 / Personal use',
      '團隊使用 / Team use',
      '商業使用 / Commercial use',
      '試用評估 / Trial / evaluation',
    ])
    .setRequired(true);

  // 3. Team Size
  form
    .addMultipleChoiceItem()
    .setTitle('團隊規模 / Team Size')
    .setChoiceValues([
      '個人 / Just me',
      '2–10 人 / 2–10 people',
      '11–50 人 / 11–50 people',
      '51+ 人 / 51+ people',
    ])
    .setRequired(true);

  // 4. Interested Agents (multi-select)
  form
    .addCheckboxItem()
    .setTitle('有興趣的 AI 員工 / Interested AI Staff')
    .setHelpText('可複選 / multiple selections allowed')
    .setChoiceValues([
      '商業分析 / Business Analysis',
      '程式開發 / Coding',
      '資料庫 / Database',
      '自訂 Agent / Custom Agent',
    ])
    .setRequired(false);

  // 5. Preferred Channels (multi-select)
  form
    .addCheckboxItem()
    .setTitle('常用通訊軟體 / Preferred Chat Apps')
    .setHelpText('可複選 / multiple selections allowed')
    .setChoiceValues([
      'Telegram',
      'Discord',
      'LINE',
      '網頁聊天 / Web Chat',
      '其他 / Other',
    ])
    .setRequired(false);

  // 6. Comments
  form
    .addParagraphTextItem()
    .setTitle('其他想說的 / Anything else?')
    .setHelpText(
      '使用情境細節、想看到的功能、合作機會... / use case details, feature requests, partnership ideas...'
    )
    .setRequired(false);

  // Output URLs to the log
  const editUrl = form.getEditUrl();
  const publishedUrl = form.getPublishedUrl();
  const shortUrl = form.shortenFormUrl(publishedUrl);

  Logger.log('==========================================');
  Logger.log('Form created successfully');
  Logger.log('==========================================');
  Logger.log('Edit URL  (do NOT share):');
  Logger.log(editUrl);
  Logger.log('');
  Logger.log('Published URL:');
  Logger.log(publishedUrl);
  Logger.log('');
  Logger.log('Short URL  (recommended for the website):');
  Logger.log(shortUrl);
  Logger.log('==========================================');

  return { editUrl: editUrl, publishedUrl: publishedUrl, shortUrl: shortUrl };
}

/**
 * Optional: register a trigger so Gmail sends you an email each time
 * someone submits the form. Run this ONCE after the form exists.
 *
 * Open the form via FormApp.openById('...') if running from a script
 * not bound to the form. Easiest path: open the form's Apps Script
 * editor directly (Form -> three-dot menu -> Script editor) and run
 * `setupEmailNotification` there.
 */
function setupEmailNotification() {
  const form = FormApp.getActiveForm();
  if (!form) {
    throw new Error(
      'No active form. Open this script from the form editor (Form -> Script editor) and rerun.'
    );
  }
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
  Logger.log('Trigger registered. Each submission will call onFormSubmit().');
}

/**
 * Triggered on each form submission.
 * Sends a digest email to NOTIFY_EMAIL.
 */
function onFormSubmit(e) {
  const responses = e.response.getItemResponses();

  let body = '';
  body += 'New CoStaff early access signup\n';
  body += '================================\n';
  body += 'Email: ' + e.response.getRespondentEmail() + '\n';
  body += 'Time:  ' + e.response.getTimestamp() + '\n\n';
  body += '--- Responses ---\n';

  responses.forEach(function (r) {
    const value = r.getResponse();
    const printable = Array.isArray(value) ? value.join(', ') : value;
    body += r.getItem().getTitle() + ': ' + printable + '\n';
  });

  GmailApp.sendEmail(
    NOTIFY_EMAIL,
    '[CoStaff] 新的搶先預約 / New early access signup',
    body
  );
}
