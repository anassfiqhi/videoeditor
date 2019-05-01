/**
 * @file Manager for sending emails
 * @author Vladan Kudlac <vladankudlac@gmail.com>
 */
import config from '../config';
const nodemailer = require("nodemailer");

export default {

	sendProjectFinished(recipient, project, success) {
		const transporter = nodemailer.createTransport({
			host: "smtp.stud.fit.vutbr.cz",
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: config.emailUser,
				pass: config.emailPasswd,
			},
			tls: {
				rejectUnauthorized: false // do not fail on invalid certs
			}
		});

		const projectLink = `${config.serverUrl}/project/${project}`;
		const videoLink = `${config.serverUrl}/project/${project}/finished`;

		const email = {
			from: '"Vladan Kudláč" <xkudla15@stud.fit.vutbr.cz>',
			to: recipient,
			subject: "Videoeditor - Projekt dokončen", // Subject line
		};

		if (success) {
			email.html = `<p>Právě bylo dokončeno zpracování výsledného videa vašeho <a href="${projectLink}">projektu</a>.</p>
				<p>Stáhnout si jej můžete na následujícím odkazu: <a href="${videoLink}">${videoLink}</a></p>
				<p>Kód pro vložení videa do stránky:</p>
				<pre>&lt;video controls src="${videoLink}" /&gt;</pre>`
			;
		}
		else {
			email.to += `, ${config.adminEmail}`;
			email.html = `<p>Váš <a href="${projectLink}">projekt</a> nemohl být zpracován.</p>
				<p>Omlouváme se za způsobené komplikace, problémem se budeme co nejdříve zabývat.</p>`;
		}

		transporter.sendMail(email, (err) => {
			if (err) console.error(`Email to ${recipient} (project ${project}) failed!`, err);
			else {
				console.info(`Email send to: "${recipient}"`);
			}
		});
	}
}