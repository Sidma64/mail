document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = mail_submit

  // By default, load the inbox
  load_mailbox('inbox');
});

function hide_all() {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector("#submit-error").style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#mail-view").style.display = 'none';

}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector("#submit-error").style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
};

function load_mailbox(mailbox) {
  
  // Hide other views
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#mail-view").style.display = "none";

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch the mails from the appropriate mailbox
  let emailsView = document.querySelector('#emails-view');
  
  fetch(`emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails);
    let emails_view = document.querySelector('#emails-view');
    emails.forEach(email => {
      // Create the HTML for the mails on the mailbox
      let email_link = document.createElement("a");
      email_link.setAttribute("onclick", `load_mail(${email.id})`);
      
      let email_div = document.createElement('div');
      email_div.classList.add('email-list');
      email_div.setAttribute("class", "rounded border p-1 m-2");
      email_link.append(email_div);

      let email_sender = document.createElement('div');
      email_sender.classList.add('email-sender');
      email_sender.innerHTML = `${email.sender}:`;
      email_div.append(email_sender);

      let email_subject = document.createElement('div');
      email_subject.classList.add('email-subject');
      email_subject.innerHTML = `${email.subject}`;
      email_div.append(email_subject);

      email_div.innerHTML = `${email.sender}: ${email.subject}`;
      emails_view.append(email_link);
    });
  });

  emailsView.style.display = 'block';

};

function load_mail(id) {
  hide_all()
  fetch(`emails/${id}`)
  .then(response => response.json())
  .then(mail => {
    console.log(mail);
    document.querySelector("#mail-sender").innerHTML = mail.sender;
    document.querySelector("#mail-recipients").innerHTML = mail.recipients.join(', ');
    document.querySelector("#mail-subject").innerHTML = mail.subject;
    document.querySelector("#mail-timestamp").innerHTML = mail.timestamp;
    document.querySelector("#mail-body").innerHTML = mail.body;
  });

  document.querySelector("#mail-view").style.display = "block";
}

function mail_submit(event) {
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);

    if (result["error"]) {
      document.querySelector("#submit-error").innerHTML = `Error: ${result["error"]}`;
      document.querySelector("#submit-error").style.display = 'block';
    } else {
      load_mailbox('sent');
    }
  })
};