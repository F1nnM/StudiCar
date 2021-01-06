<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="text-h4 q-mt-xl custom-underline c-u-l c-u-2 c-u-md q-mb-xl">
        Registrierung
        <q-btn
          icon="first_page"
          to="/auth/anmeldung"
          class="float-right"
          label="Anmeldung"
          dense
          no-caps
          outline
          rounded
        />
      </div>
      <span>Erstelle einen Account, damit wir dich in unser System aufnehmen können.</span>
    </div>
    <div class="q-mt-xl">
      <q-form @submit="dialog = true" class="q-gutter-md">
        <q-input
          hint="Gib deinen Vornamen ein"
          lazy-rules
          :rules="[ val => isValidName(val) || 'Bitte gib einen gültigen Vornamen ein.']"
          v-model="name"
          label="Name"
        />

        <q-input
          hint="Bitte gib auch deinen Nachnamen ein, damit dich andere erkennen können."
          lazy-rules
          :rules="[ val => isValidName(val) || 'Bitte gib einen gültigen Nachnamen ein.']"
          v-model="surname"
          label="Nachname"
        />

        <q-input
          hint="Unter welcher Email können wir dich erreichen?"
          lazy-rules
          :rules="[ val => val && val.length > 0 && val.length <= 255 || 'Wir brauchen deine Mailadresse, um dich ggf. erreichen zu können.']"
          v-model="email"
          label="Mail"
        />

        <q-input
          type="password"
          v-model="password"
          label="Passwort"
          hint="Gib ein sicheres Passwort ein"
          lazy-rules
          :rules="[
            val => val !== '' && val.length >= 6 || 'Dein Passwort muss mindestens 6 Zeichen lang sein.'
        ]"
        />

        <q-slide-transition>
          <div v-if="password.length">
            <q-input
              type="password"
              v-model="passwordConfirm"
              label="Passwort"
              hint="Wiederhole das obige Passwort"
              lazy-rules
              :rules="[
          val => val === password || 'Passwörter stimmen nicht überein.'
        ]"
            />
          </div>/>
        </q-slide-transition>
        <div>
          <q-btn label="Weiter" type="submit" @click="dialog=true" color="primary" />
        </div>
      </q-form>
      <q-dialog v-model="dialog" position="bottom" class="q-mx-sm">
        <q-card class="column">
          <q-toolbar>
            <q-avatar>
              <img src="~assets/app-icon.svg" />
            </q-avatar>

            <q-toolbar-title>
              <small>Nutzungsbedingungen</small>
            </q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>

          <div class="q-pa-md">
            <p>Wir legen unsere Datenschutzpolitik und unsere Allgemeinen Geschäftsbedingungen offen.</p>

            <div class="q-pr-md q-pb-xs row justify-evenly text-right">
              <q-btn @click="openAGB = true" label="Anzeigen" outline />
              <q-btn v-close-popup color="primary" label="Ich akzeptiere" @click="onSubmit" />
            </div>
          </div>
        </q-card>
        <q-dialog v-model="openAGB" full-height full-width>
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Rechtliches</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section>
              <q-tabs
                v-model="agbTab"
                dense
                align="justify"
                class="bg-white text-primary"
                :breakpoint="0"
              >
                <q-tab name="agb" label="AGB" />
                <q-tab name="dataSec" label="Datenschutz" />
              </q-tabs>
              <q-tab-panels v-model="agbTab" class="q-py-sm q-px-none">
                <q-tab-panel name="agb" class="q-pa-none" ref="agb_anchor"></q-tab-panel>
                <q-tab-panel name="dataSec" class="q-pa-none" ref="dataSec_anchor"></q-tab-panel>
              </q-tab-panels>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { openURL } from "quasar";
import { Dialog } from "quasar";

export default {
  data() {
    return {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      surname: "",
      dialog: false,
      openAGB: false,
      agbTab: "agb",
      step: 1
    };
  },

  computed: {
    agb() {
      return `<p><strong>AGB StudiCar</strong></p>
<ol>
<li><p>Gegenstand</p></li>
<li><p>Registrierung</p></li>
<li><p>Anmeldung auf der Plattform und Anlegen eines Kontos</p></li>
<li><p>Nutzung der Leistungen</p></li>
<li><p>Finanzielle Konditionen</p></li>
<li><p>Keine Gewinnerzielung und keine gewerbliche Nutzung gestattet</p></li>
<li><p>Pflichten des Nutzers</p></li>
<li><p>Datenschutz</p></li>
<li><p>Laufzeit und Kündigung des Nutzungsvertrages</p></li>
<li><p>Gewährleistung / Haftung</p></li>
<li><p>Anwendbares Recht, Gerichtsstand und Schlussbestimmungen</p></li>
<li><p><strong>Gegenstand</strong></p></li>
</ol>
<p>StudiCar, vertreten durch die Verfasste Studierendenschaft (VS) der Dualen Hochschule Baden-Württemberg (DHBW), betreibt eine Plattform für Fahrgemeinschaften, die über die URI <a href="https://pwa.studicar.mfinn.de/">https://pwa.studicar.mfinn.de/</a> in Form einer Progressive Web App (PWA) erreichbar ist. Diese dient der Bildung von Fahrgemeinschaften durch Studierende, Professoren oder Mitarbeiter der DHBW Heidenheim, die mit ihrem PKW zu der DHBW Heidenheim hin oder von dieser weg fahren. StudiCar ist hierbei zu keinem Zeitpunkt Partei eines Vertrages oder einer sonstigen die zwischen Mitgliedern geschlossenen Vereinbarung.</p>
<ol>
<li><strong>Registrierung</strong></li>
</ol>
<p>2.1 Mit der Registrierung über die Fahrgemeinschaftsplattform erkennt der Nutzer die AGB von StudiCar an.</p>
<p>2.2 Nach Eingabe der für die Registrierung notwendigen Daten wird der Nutzer über das Ergebnis der Registrierung informiert.</p>
<p>2.3 Mit erfolgreicher Registrierung kommt ein Vertrag zwischen StudiCar und dem registrierten Nutzer zustande, der die Nutzung der Fahrgemeinschaftsplattform zum Gegenstand hat („Nutzungsvertrag&quot;). Der Inhalt des Nutzungsvertrages ergibt sich aus diesen AGB. Zweck des Nutzungsvertrags ist die Vermittlung von Fahrgemeinschaften und Mitfahrgelegenheiten („Vertragszweck&quot;).</p>
<ol>
<li><strong>Anmeldung auf der Plattform und Anlegen eines Kontos</strong></li>
</ol>
<p>3.1. Anmeldebedingungen auf der Plattform</p>
<p>Die Plattform kann nur von Studierenden, Professoren und Mitarbeitern der DHBW Heidenheim genutzt werden. Die Anmeldung von Unbefugten auf dieser Plattform ist nicht gestattet. Mit dem Zugriff auf die Plattform, ihrer Nutzung oder Registrierung bestätigen Sie, dass Sie zu der oben genannten Personengruppe gehören.</p>
<p>3.2. Anlegen eines Benutzerkontos</p>
<p>Zur Anmeldung auf der Plattform müssen Sie die AGB gelesen und akzeptiert haben.</p>
<p>Unabhängig vom konkreten Verfahren mit dem Sie Ihr Konto anlegen, sind Sie dazu verpflichtet, auf Ihrem Profil wahrheitsgemäße und vollständige Angaben zu machen und diese, während Ihrer Vertragsbeziehungen mit StudiCar auf dem neuesten Stand zu halten. Sie können Ihre Angaben jederzeit im Profil oder über dortige Anweisungen aktualisieren.</p>
<p>Sie verpflichten sich, weder unter Ihrem eigenen Namen noch mit dem Namen eines Dritten, weitere Konten neben Ihrem ursprünglich angelegten Konto zu unterhalten.</p>
<h3 id="33berprfung">3.3. Überprüfung</h3>
<p>StudiCar kann Maßnahmen ergreifen, um die von Ihnen im Profil angegebenen Daten zu überprüfen, sofern dies aus Gründen der Transparenz, zur Schaffung von mehr Vertrauen oder zur Verhinderung oder Aufdeckung von Betrug erforderlich ist. Dies ist insbesondere der Fall, wenn Sie Ihre Telefonnummer eingeben oder uns ein Ausweispapier zur Verfügung stellen.</p>
<ol>
<li><strong>Nutzung der Leistungen</strong></li>
</ol>
<p>4.1. Platzieren von Anzeigen auf dem Marktplatz</p>
<p>Sofern Sie die nachstehenden Bedingungen erfüllen, können Sie als Nutzer Anzeigen auf der Plattform erstellen und veröffentlichen, indem Sie Daten über die von Ihnen geplante Fahrt eingeben (Datum / Uhrzeit, Anzahl der angebotenen Plätze, verfügbare Optionen, usw.).</p>
<p>Eine Anzeige darf nur erstellt werden, wenn die folgenden Bedingungen erfüllt sind:</p>
<ul>
<li><p>Sie verfügen über eine gültige Fahrerlaubnis</p></li>
<li><p>Sie bieten nur Anzeigen für Fahrzeuge an, die Ihnen gehören oder die Sie mit der ausdrücklichen Erlaubnis des Halters nutzen und zu deren Nutzung für Mitfahrgelegenheiten Sie berechtigt sind</p></li>
<li><p>Sie sind und bleiben der Hauptfahrer des Fahrzeugs, für das eine Anzeige geschaltet wird</p></li>
<li><p>Für das Fahrzeug besteht eine gültige Haftpflichtversicherung</p></li>
<li><p>Es besteht für Sie kein Fahrverbot, zum Beispiel aus medizinischen Gründen</p></li>
<li><p>Das Fahrzeug, das Sie für die Fahrt benutzen möchten, ist ein Pkw mit 4 Rädern und maximal 9 Sitzen</p></li>
<li><p>Es existiert noch keine Anzeige für dieselbe Fahrt</p></li>
<li><p>Sie bieten nicht mehr Plätze als vom Fahrzeughersteller ausgewiesen an</p></li>
<li><p>Alle angebotenen Plätze verfügen über einen Sicherheitsgurt, auch wenn das Fahrzeug mit Sitzen ohne Sicherheitsgurte zugelassen ist</p></li>
<li><p>Es wird ein Fahrzeug in gutem Betriebszustand benutzt, das den geltenden Gesetzen entspricht und insbesondere über eine aktuelle TÜV-Bescheinigung verfügt</p></li>
</ul>
<p>Für den Inhalt der von Ihnen auf der Plattform geschalteten Anzeige sind ausschließlich Sie selbst verantwortlich. Die in Ihrer Anzeige enthaltenen Angaben müssen daher der Wahrheit entsprechen und Sie verpflichten sich, die Fahrt unter den in Ihrer Anzeige angegebenen Bedingungen anzutreten.</p>
<p>StudiCar behält sich das Recht vor, eine Anzeige ohne Vorankündigung jederzeit zu entfernen, sofern die Anzeige nicht den AGB entspricht oder vom StudiCar-Team als schädlich für das Image von StudiCar oder die angebotenen Leistungen befürchtet wird.</p>
<p>Die Reihenfolge und Sichtbarkeit der Anzeigen liegen abgesehen von den integrierten Filtermöglichkeiten im alleinigen Ermessen von StudiCar.</p>
<h3 id="42buchungeinessitzplatzes">4.2. Buchung eines Sitzplatzes</h3>
<p>StudiCar hat ein System zur Online-Buchung von Plätzen für auf der Plattform angebotene Fahrten eingerichtet.</p>
<p>Wenn ein Mitfahrer sich für eine Anzeige interessiert, kann er eine unverbindliche Buchungsanfrage stellen. Nach manueller Validierung der Buchungsanfrage durch den Fahrer erhält der Mitfahrer eine Buchungsbestätigung.</p>
<ol>
<li><strong>Finanzielle Konditionen</strong></li>
</ol>
<h3 id="51kostenbeitrag">5.1 Kostenbeitrag</h3>
<p>Der Kostenbeitrag wird von Ihnen als Fahrer unter Ihrer alleinigen Verantwortung bestimmt. Es ist strengstens untersagt, die Plattform in irgendeiner kommerziellen Form zu nutzen. Sie verpflichten sich daher, den Kostenbeitrag, dessen Zahlung Sie von Ihren Mitfahrern verlangen, auf die Betriebskosten des PKWs zu beschränken, die Ihnen effektiv durch die Fahrt entstehen. Andernfalls tragen Sie allein das Risiko, dass Ihre Fahrt eine nach dem Personenbeförderungsgesetz oder anderen Gesetzen verbotene Personenbeförderung darstellt und erklären sich bereit, mögliche Konsequenzen auf sich zu nehmen.</p>
<p>5.2 Zahlung</p>
<p>Sie sind als Mitfahrer dazu verpflichtet, den Kostenbeitrag in bar und spätestens zum Zeitpunkt des letzten Absetzpunktes an den Fahrer zu zahlen. In Ausnahmefällen können Zahlungen im gegenseitigen Einvernehmen mit dem Fahrer auf einen späteren Zeitpunkt verschoben werden.</p>
<p>Als Fahrer verpflichten Sie sich, die Zahlung des Kostenbeitrages nicht vor Beginn der Fahrt zu verlangen.</p>
<ol>
<li><strong>Keine Gewinnerzielung und keine gewerbliche Nutzung gestattet</strong></li>
</ol>
<p>Sie verpflichten sich dazu, die Plattform und Leistungen von StudiCar ausschließlich zur Kontaktaufnahme und nicht zur Gewinnerzielung oder zu gewerblichen Zwecken zu nutzen.</p>
<p>Sie als Fahrer dürfen daher keinen höheren Kostenbeitrag als die tatsächlich angefallenen Betriebskosten für eine Fahrt verlangen und somit keinen Gewinn erzielen. Wir weisen Sie darauf hin, dass Sie als Fahrer Ihren eigenen, durch die Fahrt entstandenen Kostenanteil selbst zu tragen haben. Sie sind zudem allein für die Berechnung der Ihnen für die Fahrt entstandenen Kosten und für die Überprüfung dafür verantwortlich, dass der von Ihren Mitfahrern verlangte Betrag nicht die Kosten übersteigt, die Ihnen effektiv entstanden sind (unter Ausschluss Ihres eigenen Kostenanteils).</p>
<p>StudiCar behält sich das Recht vor, Ihr Konto vorübergehend zu sperren, Ihren Zugriff auf Leistungen zu beschränken oder, in schweren Fällen, Ihre Mitgliedschaft zu beenden, sofern Ihre Aktivität auf dieser Plattform aufgrund der Art der angebotenen Fahrten, der Häufigkeit, der Anzahl der beförderten Mitfahrer oder des verlangten Kostenbeitrags Grund zur Annahme kommerzieller Verwendung geben.</p>
<ol>
<li><strong>Pflichten des Nutzers</strong></li>
</ol>
<p>7.1 Der Nutzer verpflichtet sich, die bei der Registrierung und Nutzung der Plattform angegebenen Daten stets aktuell zu halten (insbesondere Name, Vorname, Mail-Adresse).</p>
<p>7.2 Jeder Nutzer ist verpflichtet, korrekte Angaben beim Einstellen von Inseraten oder bei der Vereinbarung von Mitfahrten zu machen.</p>
<p>7.3 Der Nutzer ist verpflichtet, dass bei der Registrierung im Rahmen der Sicherheitsvorgaben frei gewählte Passwort geheim zu halten und keinem Dritten den Zugang zum Nutzerbereich des Angebots über seine Zugangsdaten zu gewähren. Dritte ohne deren Wissen und Einverständnis auf der Plattform zu registrieren ist ebenso wenig gestattet wie die Veröffentlichung von Beiträgen oder Inhalten in deren Namen.</p>
<p>7.4 Die auf der Plattform veröffentlichten Informationen dürfen nur zu privaten Zwecken verwendet werden. Die Verbreitung von Werbenachrichten ist untersagt. Die Kontaktaufnahme mit anderen Benutzern ist allein zur Vermittlung von Fahrgemeinschaften gedacht.</p>
<p>7.5 Der Nutzer ist verpflichtet, bei der Nutzung der Webseite oder der App das jeweils geltende Recht zu beachten. Dies beinhaltet insbesondere das Verbot der Veröffentlichung beleidigender, unwahrer, gewaltverherrlichender, jugendgefährdender, rassistischer oder pornografischer Inhalte. Die Plattform darf nicht für rechtswidrige Zwecke jeglicher Art verwendet werden.</p>
<p>7.6 Nutzeraktivitäten, die darauf gerichtet sind, die Plattform funktionsuntauglich zu machen oder die Nutzung des Angebots zu erschweren, sind verboten.</p>
<p>7.7 Jeder Nutzer hat hinsichtlich der von ihm verwendeten Inhalte und Materialien sicherzustellen, dass diese frei von Rechten Dritter sind und keine Rechte Dritter verletzen. Er stellt StudiCar von Ansprüchen Dritter frei, die wegen der von ihm eingestellten Inhalte und Materialien oder wegen des Nutzerverhaltens gegenüber der Fahrgemeinschaftsplattform erhoben werden, einschließlich der dadurch verursachten angemessenen Kosten der Rechtsverteidigung.</p>
<ol>
<li><strong>Datenschutz</strong></li>
</ol>
<p>8.1 StudiCar unterscheidet zwischen personenbezogenen Daten („Personendaten&quot;, z.B. Name des Nutzers, Kontaktinformationen, Profildaten) und fahrtenbezogenen Daten („Fahrtendaten&quot; z.B. Start-/ Ziel- und Zeitpunkt einer Fahrt). Personendaten beschreiben bzw. identifizieren eine Person, Fahrtendaten beschreiben bzw. identifizieren ein Angebot oder Gesuch einer Fahrt.</p>
<p>8.2 StudiCar erhebt, speichert und verarbeitet Personendaten von Nutzern nur, soweit dies zur vertragsgemäßen Leistungserbringung erforderlich und durch gesetzliche Vorschriften erlaubt, oder vom Gesetzgeber angeordnet ist. StudiCar behandelt Personendaten entsprechend den Bestimmungen des geltenden Datenschutzrechts. Personendaten werden vertraulich behandelt und ausschließlich auf den Servern des Betreibers der Fahrgemeinschaftsplattform gespeichert und ohne ausdrückliche Einwilligung des Nutzers zu keinem Zeitpunkt an Dritte weitergegeben.</p>
<p>8.3 Mit der Registrierung räumt der Nutzer StudiCar sowohl für die Personendaten als auch für die Fahrtendaten ein auf die Verwendung und den Vertragszweck beschränktes, widerrufliches, unentgeltliches Nutzungsrecht ein. Insbesondere gilt dies für die Speicherung der Daten auf den Servern des Betreibers der Fahrgemeinschaftsplattform sowie deren Veröffentlichung, insbesondere deren öffentlicher Zugänglichmachung (z.B. durch Darstellung der Nutzerdaten auf der Plattform), sowie die Bearbeitung und Vervielfältigung der Nutzerdaten, soweit dies für die Vorhaltung bzw. Veröffentlichung erforderlich ist.</p>
<p>8.4 Weitere Hinweise zum Datenschutz und zu Zweck, Art und Umfang der Erhebung, Verarbeitung und Nutzung personenbezogener Daten können in der Datenschutzerklärung eingesehen werden.</p>
<ol>
<li><strong>Laufzeit und Kündigung des Nutzungsvertrages</strong></li>
</ol>
<p>9.1 Der mit der Registrierung verknüpfte Nutzungsvertrag zwischen StudiCar und dem Nutzer wird auf unbestimmte Zeit abgeschlossen. Sowohl Nutzer wie auch StudiCar sind jederzeit berechtigt, das Nutzungsverhältnis innerhalb von zwei Wochen zu kündigen. Die Kündigung von Seiten des Nutzers bedarf der Textform und muss per E-Mail an <a href="mailto:kuendigung@mfinn.de">kuendigung@mfinn.de</a> gesendet werden!</p>
<p>9.2 StudiCar ist ferner berechtigt, den Nutzungsvertrag mit sofortiger Wirkung zu kündigen, wenn der Nutzer durch gegen die Nutzungsbedingungen verstoßende Beiträge auf der Plattform auffällt oder anderweitig gegen wesentliche Bestimmungen dieser Nutzungsbedingungen verstößt. In geeigneten Fällen wird StudiCar den Nutzer vor Kündigung des Nutzungsvertrages ermahnen.</p>
<p>9.3 Unbeschadet einer Möglichkeit zur Kündigung des Nutzungsvertrages behält sich StudiCar vor, den Nutzer, auch mit sofortiger Wirkung, von einem oder mehreren Diensten des Angebots auszuschließen und/oder einen Nutzer-Account vorübergehend zu deaktivieren.</p>
<p>9.4 StudiCar ist nach eigenem Ermessen berechtigt, hinsichtlich einzelner Mitfahrangebote oder sonstigen Veröffentlichungen besondere Maßnahmen zu treffen, soweit diese zur Wahrung der Interessen anderer Nutzer, der Fahrgemeinschaftsplattform oder Dritter erforderlich und angemessen sind. Dazu gehören insbesondere das Löschen eines Fahrtangebots oder Löschen von Nachrichten.</p>
<p>9.5 Jegliche Daten eines Nutzers werden nach Beendigung des Nutzungsvertrags umgehend und vollständig gelöscht. Es erfolgt keine Archivierung von Daten.</p>
<ol>
<li><strong>Gewährleistung / Haftung</strong></li>
</ol>
<p>10.1 StudiCar gewährleistet nicht den jederzeitigen ordnungsgemäßen Betrieb beziehungsweise die ununterbrochene Nutzbarkeit oder Erreichbarkeit der Fahrgemeinschaftsplattform, da Störungen des Servers oder Schwankungen in der Qualität des Zugangs zur Plattform technisch nicht auszuschließen sind.</p>
<p>10.2 StudiCar ist als Diensteanbieter im Sinne des Telemediengesetzes nicht dazu verpflichtet, die übermittelten oder gespeicherten Informationen seiner Nutzer zu überwachen oder nach Umständen zu forschen, die auf rechtswidrige Handlungen hinweisen. Sollte StudiCar allerdings Kenntnis von solchen Tatsachen erlangen, prüft StudiCar den Sachverhalt und entfernt beziehungsweise sperrt die rechtswidrigen Inhalte unverzüglich.</p>
<p>10.3 Der Nutzer erkennt mit der Registrierung an, dass StudiCar keine Haftung in Bezug auf Mitfahrten oder in Bezug auf die ggf. zwischen Nutzern abgeschlossenen Verträge (etwa von Beförderungsverträgen) übernimmt.</p>
<ol>
<li><strong>Anwendbares Recht, Gerichtsstand und Schlussbestimmungen</strong></li>
</ol>
<p>11.1 Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss der Normen des Kollisionsrechts.</p>
<p>11.2 Sollten einzelne Bestimmungen dieser AGB ganz oder zum Teil unwirksam sein, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.</p>
<p>11.3 StudiCar behält sich das Recht vor, Bestimmungen dieser AGB zu ändern. StudiCar wird dem Nutzer eventuelle Änderungen der AGB über die vom Nutzer angegebene Mail-Adresse mitteilen. Widerspricht der Nutzer nicht innerhalb von sechs (6) Wochen nach Empfang der E-Mail, gelten die geänderten AGB als mit dem Nutzer vereinbart. Auf diese Frist wird der Nutzer im Rahmen der Änderungsmitteilung ausdrücklich hingewiesen. Widerspricht der Nutzer der Geltung der neuen AGB innerhalb von sechs (6) Wochen, ist StudiCar berechtigt, den Nutzungsvertrag zu kündigen.</p>
<p>11.4 StudiCar ist nicht verpflichtet und grundsätzlich nicht bereit an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
<p>11.5 Ausschließlicher Gerichtsstand für alle sich aus oder im Zusammenhang mit dem Rechtsverhältnis zwischen StudiCar und den registrierten Nutzern ergebende Streitigkeiten ist Augsburg, Deutschland.</p>
`;
    },
    dataSec() {
      return `<p><strong>Datenschutzerklärung StudiCar</strong></p>
<ol>
<li><p>Allgemeines</p></li>
<li><p>Welche Informationen erheben wir von Ihnen?</p></li>
<li><p>Datenweitergabe an Dritte</p></li>
<li><p>Auskunfts- und Widerspruchsrecht</p></li>
<li><p>Widerrufsbelehrung</p></li>
<li><p>Betroffenenrechte</p></li>
<li><p>Wie nutzen wir die von Ihnen erhobenen Daten?</p></li>
<li><p>Wer sind die Empfänger der von Ihnen erhobenen Daten und für welche Zwecke?</p></li>
<li><p>Passwort</p></li>
<li><p>Änderungen der Datenschutzerklärung</p></li>
</ol>
<p><strong>1. Allgemeines</strong></p>
<p>StudiCar, vertreten durch die Verfasste Studierendenschaft (VS) der Dualen Hochschule Baden-Württemberg (DHBW), verpflichtet sich als verantwortliche Stelle, Ihre Privatsphäre zu schützen und zu respektieren. Diese Erklärung (die „Datenschutzerklärung&quot;) soll Ihnen Auskunft über unsere Verfahren zur Erhebung, Verarbeitung oder Nutzung von Daten geben, die Sie uns über die URI <a href="https://dev.pwa.studicar.mfinn.de/">https://dev.pwa.studicar.mfinn.de/</a> zur Verfügung stellen.</p>
<p>Diese Datenschutzerklärung (zusammen mit unseren AGB) und weiteren Dokumenten, auf die in diesem Dokument verwiesen wird, bilden die Grundlage, auf der wir alle von Ihnen erhobenen oder durch Sie zur Verfügung gestellten personenbezogenen Daten verarbeiten. Lesen Sie die folgende Erklärung sorgfältig durch, um zu verstehen, wie wir Ihre personenbezogenen Daten verarbeiten.</p>
<h2 id="2welcheinformationenerhebenwirvonihnen">2. Welche Informationen erheben wir von Ihnen?</h2>
<p>Wir können die folgenden Informationen von Ihnen erheben und verarbeiten:</p>
<h3 id="21vonihnenzurverfgunggestellteinformationen">2.1 Von Ihnen zur Verfügung gestellte Informationen.</h3>
<p>Sie können uns Informationen, einschließlich solcher mit Personenbezug („personenbezogene Daten&quot;), zur Verfügung stellen, wenn Sie unsere Plattform für Fahrgemeinschaften nutzen und sich auf dieser registrieren, oder wenn Sie sich per Telefon, per E-Mail oder in sonstiger Weise mit uns in Verbindung setzen oder wenn Sie ein Problem mit unserer Plattform für Fahrgemeinschaften melden.</p>
<p>Zu den von Ihnen zur Verfügung gestellten personenbezogenen Daten können zum Beispiel gehören:</p>
<p><strong>2.1.1</strong> Pflichtangaben, die für die Registrierung für den über unsere Plattform bereitgestellten Dienst oder für den Zugriff auf andere von uns erbrachte Dienste erforderlich sind, einschließlich Name, E-Mail-Adresse, Geburtsdatum, Geschlecht, Mobiltelefonnummer und Passwort. Alle diese Felder sind Pflichteingabefelder. StudiCar ist zur Erbringung der auf unserer Plattform für Fahrgemeinschaften angebotenen Dienste nicht verpflichtet, wenn die erforderlichen Daten nicht zur Verfügung gestellt werden, und Sie können sich dann nicht über unsere Plattform für ein Benutzerkonto registrieren;</p>
<p><strong>2.1.2</strong> Ein Foto;</p>
<p><strong>2.1.3</strong> Eine Wohnanschrift;</p>
<p><strong>2.1.4</strong> Angaben zu Ihrem Auto;</p>
<p><strong>2.1.5</strong> Ihre Präferenzen;</p>
<p><strong>2.1.6</strong> Aufzeichnungen über sämtliche Korrespondenz zwischen Ihnen und uns;</p>
<p><strong>2.1.7</strong> Aufzeichnungen über sämtliche Buchungen, die Sie vorgenommen, und sämtliche Anzeigen für Mitfahrgelegenheiten, die Sie über unsere Plattform geschaltet haben;</p>
<p><strong>2.1.8</strong> Daten, die wir möglicherweise von Ihnen benötigen, wenn Sie ein Problem mit unserer Plattform oder unserer Dienstleistung melden;</p>
<p><strong>2.1.9</strong> Standortinformationen, wenn Sie in die Erhebung und Verarbeitung dieser Daten eingewilligt haben;Nu</p>
<p><strong>2.2 Von uns automatisch erhobene Daten</strong></p>
<p><strong>2.2.1</strong> Bei jedem Besuch auf unserer Plattform können wir, im Einklang mit geltendem Recht und, soweit erforderlich, mit Ihrer Einwilligung, Daten über die von Ihnen genutzten Geräte, über die Netzwerke, mit denen Sie verbunden sind, oder über Ihre Aktivitäten auf der Plattform erheben. Diese können die folgenden Informationen betreffen: Ihre IP-Adresse, Login-Daten, Typ und Version des Browsers, Typen und Versionen der Browser-Plugins, Betriebssystem und Plattform, Informationen über Ihren Besuch einschließlich des URL-Clickstreams zu unserer Plattform, auf dieser und weg von dieser, von Ihnen angesehene und gesuchte Produkte, Fehler beim Herunterladen, Länge der Besuche auf bestimmten Seiten und Interaktionen mit den Seiten Wir erheben diese Daten mit Hilfe verschiedener Technologien einschließlich Cookies.</p>
<p><strong>2.2.2</strong> Wir erheben aggregierte Daten über Ihre Aktivitäten auf unserer Plattform (wie etwa die Anzahl der angebotenen Mitfahrten, wie häufig Sie auf Anfragen geantwortet haben etc.).</p>
<p><strong>2.3 Aufbewahrungsfristen</strong></p>
<p><strong>2.3.1.</strong> Mit Ausnahme der in Ziffer 2.3.2 und 2.3.3 genannten Datenkategorien speichern wir Ihre personenbezogenen Daten für die Dauer Ihrer Beziehung mit uns und werden diese wie folgt sperren bzw. löschen:</p>
<ul>
<li>5 Jahre nach der letzten Nutzung unserer Plattform, wenn Sie Ihr Konto nicht deaktiviert haben;</li>
<li>1 Jahr nach der Deaktivierung Ihres Kontos, es sei denn Sie haben eine negative Bewertung erhalten; in diesem Fall speichern wir Ihre personenbezogenen Daten entweder für einen Zeitraum (i) von zwei Jahren nach der jüngsten negativen Bewertung oder (ii) von einem Jahr nach der Deaktivierung Ihres Kontos. Es gilt der längere der beiden vorgenannten Zeiträume.
Nach Ablauf der allgemeinen Verjährungsfrist werden wir gesperrte personenbezogenen Daten löschen.</li>
</ul>
<p><strong>2.3.2.</strong> Die folgende Kategorie von personenbezogenen Daten kann von uns für abweichende Zeiträume gespeichert werden:</p>
<ul>
<li>Mitgliedergenerierte Inhalte (Bewertungen, Kommentare, etc.) werden von uns nach Ablauf des in Ziffer 2.3.1 genannten Zeitraums anonymisiert und bleiben in anonymisierter Form auf unserer Plattform sichtbar.</li>
</ul>
<p><strong>2.3.3.</strong> Sofern Ihr Konto zeitweilig oder dauerhaft von uns gesperrt wurde (insbesondere wegen Verstoßes gegen unsere AGB), speichern wir Ihre personenbezogenen Daten für die Dauer von 2 bis 10 Jahren ab dem Zeitpunkt der Sperrung, um eine Umgehung der Sperrung und der übrigen Regelungen unserer AGB zu verhindern.</p>
<p><strong>3. Datenweitergabe an Dritte</strong></p>
<p>Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken findet nicht statt.</p>
<p>Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:</p>
<ul>
<li>Sie Ihre nach Art. 6 Abs. 1 S. 1 lit. a DSGVO ausdrückliche Einwilligung dazu erteilt haben,</li>
<li>die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. f DSGVO zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist und kein Grund zur Annahme besteht, dass Sie ein überwiegendes schutzwürdiges Interesse an der Nichtweitergabe Ihrer Daten haben,</li>
<li>für den Fall, dass für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht, sowie</li>
<li>dies gesetzlich zulässig und nach Art. 6 Abs. 1 S. 1 lit. b DSGVO für die Abwicklung von Vertragsverhältnissen mit Ihnen erforderlich ist.</li>
</ul>
<p><strong>4. Auskunfts- und Widerspruchsrecht</strong></p>
<p>Der Nutzer kann auf Nachfrage per E-Mail an <a href="mailto:auskunft@mfinn.de">auskunft@mfinn.de</a> jederzeit Auskunft über die unter seinem Benutzernamen gespeicherte Daten erhalten.</p>
<p>Der Nutzer kann der Nutzung seiner Daten durch Beendigung des Nutzungsvertrags jederzeit widersprechen. Bei Beendigung des Nutzungsvertrags bzw. Löschung des Accounts werden alle Daten des Nutzers unverzüglich und vollständig gelöscht. Es erfolgt keine Archivierung von Daten.</p>
<p>Sofern Ihre personenbezogenen Daten auf Grundlage von berechtigten Interessen gemäß Art. 6 Abs. 1 S. 1 lit. f DSGVO verarbeitet werden, haben Sie das Recht, gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten einzulegen, soweit dafür Gründe vorliegen, die sich aus Ihrer besonderen Situation ergeben oder sich der Widerspruch gegen Direktwerbung richtet. Im letzteren Fall haben Sie ein generelles Widerspruchsrecht, das ohne Angabe einer besonderen Situation von uns umgesetzt wird.</p>
<p><strong>5. Widerrufsbelehrung</strong></p>
<p>Der Nutzer kann seine Registrierung jederzeit ohne Frist und ohne Angabe von Gründen in Textform per E-Mail an <a href="mailto:kuendigung@mfinn.de">kuendigung@mfinn.de</a> widerrufen. Bei Widerruf werden alle Daten des Nutzers unverzüglich und vollständig gelöscht. Es erfolgt keine Archivierung von Daten.</p>
<p><strong>6. Betroffenenrechte</strong></p>
<p>Sie haben das Recht:</p>
<ul>
<li>gemäß Art. 15 DSGVO Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen. Insbesondere können Sie Auskunft über die Verarbeitungszwecke, die Kategorie der personenbezogenen Daten, die Kategorien von Empfängern, gegenüber denen Ihre Daten offengelegt wurden oder werden, die geplante Speicherdauer, das Bestehen eines Rechts auf Berichtigung, Löschung, Einschränkung der Verarbeitung oder Widerspruch, das Bestehen eines Beschwerderechts, die Herkunft ihrer Daten, sofern diese nicht bei uns erhoben wurden, sowie über das Bestehen einer automatisierten Entscheidungsfindung einschließlich Profiling und ggf. aussagekräftigen Informationen zu deren Einzelheiten verlangen;</li>
<li>gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen;</li>
<li>gemäß Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen, soweit nicht die Verarbeitung zur Ausübung des Rechts auf freie Meinungsäußerung und Information, zur Erfüllung einer rechtlichen Verpflichtung, aus Gründen des öffentlichen Interesses oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist;</li>
<li>gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen, soweit die Richtigkeit der Daten von Ihnen bestritten wird, die Verarbeitung unrechtmäßig ist, Sie aber deren Löschung ablehnen und wir die Daten nicht mehr benötigen, Sie jedoch diese zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigen oder Sie gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung eingelegt haben;</li>
<li>gemäß Art. 20 DSGVO Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesebaren Format zu erhalten oder die Übermittlung an einen anderen Verantwortlichen zu verlangen;</li>
<li>gemäß Art. 7 Abs. 3 DSGVO Ihre einmal erteilte Einwilligung jederzeit gegenüber uns zu widerrufen. Dies hat zur Folge, dass wir die Datenverarbeitung, die auf dieser Einwilligung beruhte, für die Zukunft nicht mehr fortführen dürfen und</li>
<li>gemäß Art. 77 DSGVO sich bei einer Aufsichtsbehörde zu beschweren. In der Regel können Sie sich hierfür an die Aufsichtsbehörde Ihres üblichen Aufenthaltsortes oder Arbeitsplatzes oder unseres Kanzleisitzes wenden.</li>
</ul>
<h2 id="7wienutzenwirdievonihnenerhobenendaten">7. Wie nutzen wir die von Ihnen erhobenen Daten?</h2>
<p>Wir werden die von uns erhobenen Daten nutzen:</p>
<p>|   <strong>Zweck</strong> |   <strong>Rechtsgrundlage</strong> |
| --- | --- |
|   *<em>7<strong><em></em>.1. **um unsere Pflichten im Rahmen aller zwischen Ihnen und uns abgeschlossenen Verträge zu erfüllen und Ihnen die von Ihnen verlangten Informationen und Dienstleistungen zur Verfügung zu stellen; | Diese Verarbeitung ist erforderlich zur Erfüllung unserer gegenseitigen vertraglichen Verpflichtungen. |
|   *<em>7</em></strong></em>.2. **um Informationen im Zusammenhang mit unserer Dienstleistungen (z.B. Ihre Buchungsbestätigung) per E-Mail und/oder mit einem anderen Kommunikationsmittel an Sie zu übermitteln; | Diese Verarbeitung ist erforderlich zur Erfüllung unserer gegenseitigen vertraglichen Verpflichtungen und/oder erfolgt aufgrund Ihrer Einwilligung. |
|   *<em>7<strong><em></em>.3. **damit Sie Ihr Benutzerprofil auf unserer Plattform personalisieren können; |  Diese Verarbeitung erfolgt aufgrund Ihrer Einwilligung. |
|   *<em>7</em></strong></em>.4. **damit Sie sich mit anderen Mitgliedern über unsere Dienstleistungen oder über die Fahrt(en), die Sie mit anderen Mitgliedern geteilt haben/teilen werden, austauschen können und/oder um solche Fahrten zu organisieren; | Diese Verarbeitung ist erforderlich zur Erfüllung unserer gegenseitigen vertraglichen Verpflichtungen und/oder erfolgt aufgrund Ihrer Einwilligung. |
|   *<em>7<strong><em></em>.5. **um Ihnen den Zugang zu unseren Supportdiensten und die Kontaktaufnahme mit unserem Mitglieder-Betreuungsteam zu ermöglichen; | Diese Verarbeitung (i) ist erforderlich zur Erfüllung unserer gegenseitigen vertraglichen Verpflichtungen, (ii) erfolgt aufgrund Ihrer Einwilligung, und/oder (iii) ist erforderlich zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen. |
|   *<em>7</em></strong></em>.6. *<em>um die Einhaltung (i) geltenden Rechts, (ii) unserer Allgemeinen Geschäftsbedingungen, (iii) der Datenschutzerklärung und (iv) des Verhaltenskodexes sicherzustellen. Bestimmte von uns als unangemessen betrachtete Verstöße können die Sperrung Ihres Kontos zur Folge haben; | Diese Verarbeitung ist erforderlich (i) zur Erfüllung unserer gegenseitigen vertraglichen Verpflichtungen, (ii) zur Erfüllung einer rechtlichen Verpflichtung und/oder (iii) zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen. |
|   <strong>7</strong></em>*.7. **um Sie über Änderungen unserer Dienstleistung zu benachrichtigen; |  Diese Verarbeitung ist erforderlich (i) zur Erfüllung unserer gegenseitigen vertraglichen Verpflichtungen, (ii) zur Erfüllung einer rechtlichen Verpflichtung und/oder (iii) zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen. |
| <strong>7.8.</strong> um eine möglichst effektive Darbietung der Inhalte für Sie und über Ihr Gerät sicherzustellen; |  Diese Verarbeitung erfolgt zur Wahrung der berechtigten Interessen von StudiCar (um Ihnen relevante Inhalte darzustellen). |
| **7.9. ** um Ihnen zu ermöglichen, die interaktiven Funktionalitäten unserer Dienstleistung zu nutzen, wenn Sie dies möchten; |  Diese Verarbeitung (i) ist erforderlich zur Erfüllung unserer gegenseitigen vertraglichen Verpflichtungen, und/oder (ii) erfolgt aufgrund Ihrer Einwilligung. |
| **7.10. ** um dafür zu sorgen, dass unsere Plattform sicher bleibt; |  Diese Verarbeitung ist erforderlich (i) zur Wahrung der berechtigten Interessen von StudiCar (die Sicherheit der Website/App zu gewährleisten), (ii) zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen und/oder (iii) zur Erfüllung einer rechtlichen Verpflichtung |</p>
<p><strong>8. Wer sind die Empfänger der von Ihnen erhobenen Daten und für welche Zwecke?</strong></p>
<p><strong>8.1</strong> Wenn Sie unsere Dienstleistungen nutzen, werden einige Daten über Sie entweder über Ihr öffentliches Profil oder während des Buchungsvorgangs an entsprechende Mitglieder unserer Plattform in dem Umfang weitergegeben, wie dies für die Erbringung der Dienstleistung erforderlich ist.</p>
<p><strong>8.2</strong> Wir legen Daten über Sie, einschließlich Ihrer personenbezogenen Daten, nur in den folgenden Fällen gegenüber diesen Dritten offen:</p>
<ul>
<li><p><strong>8.2.1</strong> Als Teil des Buchungsvorganges und zur Erbringung der verlangten Dienstleistungen können Daten wie etwa Ihr Name, Ihr Foto, Ihre Mobilfunknummer und/oder E-Mail-Adresse auf der Plattform angezeigt werden und/oder an einen Mitfahrer (wenn Sie ein Fahrer sind) oder an einen Fahrer (wenn Sie ein Mitfahrer sind) weitergegeben werden;</p></li>
<li><p><strong>8.2.2</strong> Als Teil unseres Bewertungssystems werden die von Ihnen geschriebenen Bewertungen auf der Plattform veröffentlicht. Die Bewertungen einschließlich der Abkürzung Ihres Namens uns Ihres Fotos sind für alle Besucher der Plattform sichtbar.</p></li>
<li><p><strong>8.2.3</strong> StudiCar kann Ihre Daten auch offenlegen, wenn wir gesetzlich dazu verpflichtet sind oder in gutem Glauben davon ausgehen, dass ein solcher Zugriff, eine solche Sicherstellung oder eine solche Offenlegung (i) zur Beantwortung von gegen StudiCar geltend gemachten Ansprüchen, (ii) zur Befolgung
einer gerichtlichen oder behördlichen Anordnung oder Aufforderung, (iii) zur Durchsetzung einer Vereinbarung mit unseren Nutzern wie etwa unserer Allgemeinen Geschäftsbedingungen, unserer Datenschutzerklärung oder unseres Verhaltenskodex, (iv) bei einem Notfall, der mit Gefahren für Leib und Leben von Personen oder für die öffentliche Gesundheit verbunden ist, (v) im Rahmen von Ermittlungen oder (vi) zum Schutz der Rechte, des Eigentums oder der persönlichen Sicherheit von StudiCar, seinen Mitarbeitern oder anderen erforderlich sind;</p></li>
</ul>
<h2 id="9passwort">9. Passwort</h2>
<p>Wenn Sie ein Passwort gewählt haben, das Ihnen den Zugang zu Teilen unserer Plattform ermöglicht, sind Sie dafür verantwortlich, dieses Passwort vertraulich zu behandeln. Wir bitten Sie, das Passwort niemandem mitzuteilen.</p>
<h2 id="10nderungenderdatenschutzerklrung">10. Änderungen der Datenschutzerklärung</h2>
<p>Alle künftigen Änderungen unserer Datenschutzerklärung werden immer auf unserer Plattform veröffentlicht.</p>`;
    }
  },

  watch: {
    agbTab: function(newv) {
      setTimeout(_ => {
        var a = this.$refs[newv + "_anchor"];

        a.$el.innerHTML = this[newv];
      }, 50);
    }
  },

  methods: {
    isValidName(text) {
      if (!(text.length > 0 && text.length <= 255)) return false;
      const pattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
      if (!text.match(pattern)) return false;
      return true;
    },
    onSubmit() {
      let credentials = {
        email: this.email,
        password: this.password,
        name: this.name,
        surname: this.surname
      };
      this.$store
        .dispatch("auth/register", credentials)
        .then(user => {
          this.$router.replace({ name: "marketplace" }).catch(() => {});
        })
        .catch(error => {
          this.$q.notify("Invalid Login!");
          console.error(`Not signed in: ${error.message}`);
        });
    }
  }
};
</script>