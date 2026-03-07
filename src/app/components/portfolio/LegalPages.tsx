import React from "react";
import { motion } from "motion/react";
import { X, Shield, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";

interface LegalPagesProps {
  language: string;
}

/* ─────────────────────── IMPRESSUM ─────────────────────── */

interface ImpressumDialogProps extends LegalPagesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImpressumDialog = ({
  language,
  open,
  onOpenChange,
}: ImpressumDialogProps) => {
  const isDE = language === "DE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!bg-zinc-950 !border-zinc-800/60 !text-white !max-w-2xl !max-h-[85vh] overflow-y-auto !rounded-2xl !p-0 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/40 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <DialogTitle className="!text-xl !text-white">
              Impressum
            </DialogTitle>
          </div>
          <DialogClose className="!static !opacity-100 w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-center hover:bg-zinc-700/50 transition-colors">
            <X className="w-4 h-4 text-zinc-400" />
          </DialogClose>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8">
          {/* Angaben gemäß § 5 TMG */}
          <Section title={isDE ? "Angaben gemäß § 5 TMG" : "Information according to § 5 TMG"}>
            <p className="text-zinc-300">
              Edis Muminović
              <br />
              Bad Soden am Taunus
              <br />
              {isDE ? "Deutschland" : "Germany"}
            </p>
          </Section>

          {/* Kontakt */}
          <Section title={isDE ? "Kontakt" : "Contact"}>
            <div className="space-y-2 text-zinc-300">
              <p>
                <span className="text-zinc-500">E-Mail:</span>{" "}
                edis.design@outlook.com
              </p>
            </div>
          </Section>

          {/* Verantwortlich für den Inhalt */}
          <Section
            title={
              isDE
                ? "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV"
                : "Responsible for content according to § 55 para. 2 RStV"
            }
          >
            <p className="text-zinc-300">
              Edis Muminović
              <br />
              Bad Soden am Taunus
            </p>
          </Section>

          {/* Haftungsausschluss */}
          <Section
            title={isDE ? "Haftung für Inhalte" : "Liability for Content"}
          >
            <p className="text-zinc-400 text-sm leading-relaxed">
              {isDE
                ? "Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen."
                : "As a service provider, we are responsible for our own content on these pages in accordance with § 7 para. 1 TMG under general law. According to §§ 8 to 10 TMG, however, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity."}
            </p>
          </Section>

          <Section
            title={isDE ? "Haftung für Links" : "Liability for Links"}
          >
            <p className="text-zinc-400 text-sm leading-relaxed">
              {isDE
                ? "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich."
                : "Our website contains links to external websites of third parties, over whose content we have no influence. Therefore, we cannot accept any liability for this third-party content. The respective provider or operator of the linked pages is always responsible for the content of those pages."}
            </p>
          </Section>

          <Section title={isDE ? "Urheberrecht" : "Copyright"}>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {isDE
                ? "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers."
                : "The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator."}
            </p>
          </Section>

          {/* Subtle footer note */}
          <div className="pt-4 border-t border-zinc-800/40">
            <p className="text-zinc-600 text-xs">
              {isDE ? "Stand: Februar 2026" : "Last updated: February 2026"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ──────────────────── PRIVACY POLICY ──────────────────── */

interface PrivacyDialogProps extends LegalPagesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrivacyDialog = ({
  language,
  open,
  onOpenChange,
}: PrivacyDialogProps) => {
  const isDE = language === "DE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!bg-zinc-950 !border-zinc-800/60 !text-white !max-w-2xl !max-h-[85vh] overflow-y-auto !rounded-2xl !p-0 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/40 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <DialogTitle className="!text-xl !text-white">
              {isDE ? "Datenschutzerklärung" : "Privacy Policy"}
            </DialogTitle>
          </div>
          <DialogClose className="!static !opacity-100 w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-center hover:bg-zinc-700/50 transition-colors">
            <X className="w-4 h-4 text-zinc-400" />
          </DialogClose>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8">
          {/* 1. Datenschutz auf einen Blick */}
          <Section
            title={
              isDE
                ? "1. Datenschutz auf einen Blick"
                : "1. Privacy at a Glance"
            }
          >
            <SubSection
              title={isDE ? "Allgemeine Hinweise" : "General Information"}
            >
              <p className="text-zinc-400 text-sm leading-relaxed">
                {isDE
                  ? "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können."
                  : "The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to personally identify you."}
              </p>
            </SubSection>
          </Section>

          {/* 2. Hosting */}
          <Section title={isDE ? "2. Hosting" : "2. Hosting"}>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {isDE
                ? "Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v.a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln."
                : "This website is hosted externally. The personal data collected on this website is stored on the host's servers. This may include IP addresses, contact requests, meta and communication data, contract data, contact details, names, website access, and other data generated via a website."}
            </p>
          </Section>

          {/* 3. Allgemeine Hinweise */}
          <Section
            title={
              isDE
                ? "3. Allgemeine Hinweise und Pflichtinformationen"
                : "3. General Information and Mandatory Disclosures"
            }
          >
            <SubSection title={isDE ? "Datenschutz" : "Data Protection"}>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {isDE
                  ? "Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung."
                  : "The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy."}
              </p>
            </SubSection>
            <SubSection
              title={
                isDE
                  ? "Hinweis zur verantwortlichen Stelle"
                  : "Note on the Responsible Entity"
              }
            >
              <p className="text-zinc-400 text-sm leading-relaxed">
                {isDE
                  ? "Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:"
                  : "The responsible entity for data processing on this website is:"}
              </p>
              <p className="text-zinc-300 mt-2">
                Edis Muminović
                <br />
                Bad Soden am Taunus
                <br />
                E-Mail: edis.design@outlook.com
              </p>
            </SubSection>
          </Section>

          {/* 4. Datenerfassung */}
          <Section
            title={
              isDE
                ? "4. Datenerfassung auf dieser Website"
                : "4. Data Collection on This Website"
            }
          >
            <SubSection title={isDE ? "Server-Log-Dateien" : "Server Log Files"}>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {isDE
                  ? "Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse."
                  : "The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are: browser type and version, operating system used, referrer URL, hostname of the accessing computer, time of the server request, IP address."}
              </p>
            </SubSection>
            <SubSection
              title={isDE ? "Kontaktformular" : "Contact Form"}
            >
              <p className="text-zinc-400 text-sm leading-relaxed">
                {isDE
                  ? "Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter."
                  : "If you send us inquiries via the contact form, your details from the inquiry form, including the contact data you provided, will be stored by us for the purpose of processing the inquiry and in case of follow-up questions. We do not share this data without your consent."}
              </p>
            </SubSection>
          </Section>

          {/* 5. Plugins und Tools */}
          <Section
            title={isDE ? "5. Plugins und Tools" : "5. Plugins and Tools"}
          >
            <SubSection title="Google Fonts (lokal)">
              <p className="text-zinc-400 text-sm leading-relaxed">
                {isDE
                  ? "Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten sogenannte Google Fonts, die lokal installiert sind. Eine Verbindung zu Servern von Google findet dabei nicht statt."
                  : "This site uses so-called Google Fonts for the uniform display of fonts, which are installed locally. No connection to Google servers is made."}
              </p>
            </SubSection>
          </Section>

          {/* 6. Ihre Rechte */}
          <Section
            title={isDE ? "6. Ihre Rechte" : "6. Your Rights"}
          >
            <p className="text-zinc-400 text-sm leading-relaxed">
              {isDE
                ? "Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen."
                : "You have the right to receive information about the origin, recipient, and purpose of your stored personal data free of charge at any time. You also have the right to request the correction or deletion of this data. If you have given consent to data processing, you can revoke this consent at any time for the future. You also have the right to request the restriction of the processing of your personal data under certain circumstances."}
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed mt-3">
              {isDE
                ? "Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden."
                : "You can contact us at any time regarding this and other questions about data protection."}
            </p>
          </Section>

          {/* Subtle footer note */}
          <div className="pt-4 border-t border-zinc-800/40">
            <p className="text-zinc-600 text-xs">
              {isDE ? "Stand: Februar 2026" : "Last updated: February 2026"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ─────────────────── HELPER COMPONENTS ─────────────────── */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-4"
  >
    <h3 className="text-zinc-100 text-base tracking-tight border-b border-zinc-800/40 pb-2">
      {title}
    </h3>
    {children}
  </motion.div>
);

const SubSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2 mt-3">
    <h4 className="text-zinc-300 text-sm">{title}</h4>
    {children}
  </div>
);