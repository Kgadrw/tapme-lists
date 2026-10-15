import { useMemo } from "react";
import { applyEmployeeSeo, getEmployee, syncEmployeeRoute } from "./employees";

export default function App() {
  const employee = useMemo(() => {
    syncEmployeeRoute();
    const person = getEmployee();
    applyEmployeeSeo(person);
    return person;
  }, []);

  const phoneDigits = employee.tel.replace(/\D/g, "");
  const phoneE164 = `+${phoneDigits}`;
  const whatsappUrl = `https://wa.me/${phoneDigits}`;
  const emailUrl = `mailto:${employee.email}`;
  const telUrl = `tel:${phoneE164}`;

  const details = [
    { label: "Position", value: employee.position },
    { label: "Email", value: employee.email, href: emailUrl },
    { label: "Tel", value: employee.tel, href: telUrl },
    { label: "Emp Id", value: employee.empId },
  ];

  function buildVCard() {
    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${employee.lastName};${employee.firstName};;;`,
      `FN:${employee.name}`,
      `ORG:${employee.company}`,
      `TITLE:${employee.position}`,
      `TEL;TYPE=CELL,VOICE:${phoneE164}`,
      `EMAIL;TYPE=INTERNET:${employee.email}`,
      `NOTE:Employee ID ${employee.empId} - ${employee.company}`,
      "END:VCARD",
    ].join("\r\n");
  }

  function saveContact(event) {
    event.preventDefault();

    const vcard = buildVCard();
    const fileName = `${employee.firstName}_${employee.lastName}.vcf`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      window.location.href = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
      return;
    }

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  return (
    <main className="min-h-dvh bg-[#212021]">
      <article className="flex min-h-dvh w-full flex-col overflow-hidden bg-white">
        <header className="relative flex flex-col items-center rounded-b-[14px] bg-[#212021] px-6 pb-40 pt-[max(2.75rem,env(safe-area-inset-top))]">
          <img
            src="/tapme-logo.webp"
            alt="TapMe"
            width={56}
            height={56}
            decoding="async"
            className="h-14 w-14 object-contain"
          />
          <h1 className="mt-10 text-[21px] font-bold tracking-[0.04em] text-white">
            DIGITAL EMPLOYEE CARD
          </h1>
          <img
            src={employee.photo}
            alt={`Portrait of ${employee.name}`}
            width={200}
            height={232}
            fetchPriority="high"
            decoding="async"
            className="absolute top-full left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2"
          />
        </header>

        <section className="flex flex-1 flex-col items-center px-6 pt-[8.25rem] pb-8">
          <h2 className="flex items-center gap-2 text-[26px] font-bold tracking-tight text-[#161616]">
            {employee.name}
            <img
              src="/checkmark.webp"
              alt="Verified"
              width={28}
              height={28}
              decoding="async"
              className="h-7 w-7 shrink-0 object-contain"
            />
          </h2>

          <div className="mt-4 flex w-full max-w-[360px] items-center justify-center gap-2">
            <button
              type="button"
              onClick={saveContact}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#111111] px-3 py-2.5 text-[12px] font-bold tracking-wide whitespace-nowrap text-white"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-current"
                aria-hidden="true"
              >
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6Zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
              </svg>
              Add Contact
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-[12px] font-bold tracking-wide whitespace-nowrap text-white no-underline"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-current"
                aria-hidden="true"
              >
                <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.94.53 3.76 1.46 5.34L2 22l4.98-1.56a9.86 9.86 0 0 0 5.06 1.39h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Zm5.5 13.99c-.23.64-1.34 1.18-1.86 1.25-.48.07-1.08.1-1.74-.11-.4-.12-.91-.3-1.57-.58-2.76-1.19-4.56-3.98-4.7-4.16-.13-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 1-2.27.23-.2.62-.3.93-.3h.27c.24 0 .4.02.57.44.23.58.77 2 .84 2.15.07.15.11.32.02.51-.1.2-.15.32-.3.5-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.16.28.73 1.2 1.56 1.94 1.08.96 1.98 1.25 2.26 1.4.28.14.45.12.61-.07.17-.2.7-.81.89-1.09.18-.28.37-.23.62-.13.26.1 1.63.77 1.91.91.28.14.47.21.54.33.07.11.07.66-.16 1.3Z" />
              </svg>
              Send Message
            </a>

            <a
              href={emailUrl}
              aria-label="Send email"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] no-underline"
            >
              <svg
                viewBox="0 0 48 48"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fill="#4CAF50"
                  d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"
                />
                <path
                  fill="#1E88E5"
                  d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"
                />
                <polygon
                  fill="#E53935"
                  points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
                />
                <path
                  fill="#C62828"
                  d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
                />
                <path
                  fill="#FBC02D"
                  d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0C43.076,8,45,9.924,45,12.298z"
                />
              </svg>
            </a>
          </div>

          <dl className="mt-6 grid w-max max-w-full grid-cols-[max-content_max-content_max-content] gap-x-2.5 gap-y-4 text-[15px] leading-tight text-[#1a1a1a]">
            {details.map((row) => (
              <div key={row.label} className="contents">
                <dt className="font-bold">{row.label}</dt>
                <dd className="font-bold">:</dd>
                <dd
                  className={
                    row.label === "Position" ? "font-bold" : "font-normal"
                  }
                >
                  {row.href ? (
                    <a href={row.href} className="text-inherit no-underline">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="px-6 pb-3 text-center text-[11px] leading-relaxed text-[#666666]">
          For more info, WhatsApp us at{" "}
          <a href="https://wa.me/250787391113" className="text-inherit underline-offset-2">
            0787 391 113
          </a>
          , call{" "}
          <a href="tel:+250799646246" className="text-inherit underline-offset-2">
            0799 646 246
          </a>
          , or email{" "}
          <a href="mailto:tapmeltd@gmail.com" className="text-inherit underline-offset-2">
            tapmeltd@gmail.com
          </a>
          . Based in Kigali, Rwanda.
        </p>

        <footer className="flex shrink-0 items-center justify-center gap-2 bg-[#212021] px-6 py-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <img
            src="/verified.webp"
            alt=""
            width={22}
            height={22}
            decoding="async"
            className="h-[22px] w-[22px] object-contain"
            aria-hidden="true"
          />
          <p className="text-[14px] font-semibold tracking-wide text-white">
            Protected Privacy
          </p>
        </footer>
      </article>
    </main>
  );
}
