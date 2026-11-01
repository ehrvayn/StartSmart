function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-page py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <a href="/" className="inline-flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/StartSmartLogo.png" alt="" className="h-7 w-7" />
              <span className="text-sm font-bold tracking-tight">
                StartSmart
              </span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Structured business viability reports for founders in the
              Philippines.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 sm:gap-16">
            <div>
              <p className="label-mono">Product</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="/#what-you-get"
                    className="text-muted transition-colors hover:text-ink"
                  >
                    What you get
                  </a>
                </li>
                <li>
                  <a
                    href="/#how-it-works"
                    className="text-muted transition-colors hover:text-ink"
                  >
                    How it works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="label-mono">Note</p>
              <p className="mt-3 max-w-[16rem] leading-relaxed text-muted">
                Estimates are guidance, not financial or legal advice.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 StartSmart. All rights reserved.</p>
          <p>Made for founders who do the work.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
