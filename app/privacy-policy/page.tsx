export default function PrivacyPolicy() {
	return (
		<main className='min-h-screen bg-white text-slate-900 selection:bg-indigo-100'>
			<div className='max-w-7xl mx-auto px-6 pt-4 pb-16'>
				{/* Title */}
				<div className='mb-12'>
					<h1 className='text-4xl font-semibold tracking-tight mb-4'>
						Privacy Policy
					</h1>
					<p className='text-slate-500 text-sm'>
						Last updated: January 1, 2024
					</p>
				</div>

				{/* Content */}
				<div className='space-y-10 text-[15px] leading-relaxed'>
					<section>
						<p className='text-slate-600'>
							This Privacy Policy describes how{' '}
							<span className='font-medium text-slate-900'>Testorium</span>{' '}
							collects, uses, and protects your personal information when you
							use our website and services. By accessing or using our platform,
							you agree to the terms outlined below.
						</p>
					</section>

					<section>
						<h2 className='text-xl font-semibold mb-3'>
							1. Information We Collect
						</h2>
						<p className='text-slate-600 mb-3'>
							We may collect personal information that you voluntarily provide
							when using our services, including but not limited to:
						</p>
						<ul className='list-disc pl-5 space-y-2 text-slate-600'>
							<li>Name and contact details (email address, etc.)</li>
							<li>Account credentials and login data</li>
							<li>Usage data and interaction with our platform</li>
							<li>
								Technical data such as IP address, browser type, device info
							</li>
						</ul>
					</section>

					<section>
						<h2 className='text-xl font-semibold mb-3'>
							2. How We Use Your Information
						</h2>
						<p className='text-slate-600 mb-3'>
							We use the collected information to:
						</p>
						<ul className='list-disc pl-5 space-y-2 text-slate-600'>
							<li>Provide, operate, and maintain our services</li>
							<li>Improve user experience and optimize functionality</li>
							<li>Communicate with you (updates, support, notifications)</li>
							<li>Prevent fraud and ensure platform security</li>
							<li>Comply with legal obligations</li>
						</ul>
					</section>

					<section>
						<h2 className='text-xl font-semibold mb-3'>3. Data Retention</h2>
						<p className='text-slate-600'>
							We retain your personal data only for as long as necessary to
							fulfill the purposes outlined in this policy, unless a longer
							retention period is required or permitted by law. Once data is no
							longer needed, we safely delete or anonymize it.
						</p>
					</section>

					<section>
						<h2 className='text-xl font-semibold mb-3'>4. Data Protection</h2>
						<p className='text-slate-600'>
							We implement appropriate technical and organizational measures to
							protect your personal data from unauthorized access, alteration,
							disclosure, or destruction. However, no method of transmission
							over the Internet is 100% secure.
						</p>
					</section>

					<section>
						<h2 className='text-xl font-semibold mb-3'>
							5. Sharing of Information
						</h2>
						<p className='text-slate-600 mb-3'>
							We do not sell or rent your personal information. We may share
							data:
						</p>
						<ul className='list-disc pl-5 space-y-2 text-slate-600'>
							<li>With service providers who help operate our platform</li>
							<li>When required by law or legal process</li>
							<li>To protect rights, safety, or prevent fraud</li>
						</ul>
					</section>

					<section>
						<h2 className='text-xl font-semibold mb-3'>
							6. Cookies & Tracking
						</h2>
						<p className='text-slate-600'>
							We use cookies and similar tracking technologies to enhance your
							experience. These may include analytics tools, session cookies,
							and preference storage. You can control cookie usage through your
							browser settings.
						</p>
					</section>

					<section>
						<h2 className='text-xl font-semibold mb-3'>
							7. Third-Party Services
						</h2>
						<p className='text-slate-600'>
							Our platform may contain links to third-party websites or
							services. We are not responsible for their privacy practices. We
							recommend reviewing their policies before interacting with them.
						</p>
					</section>

					<section>
						<h2 className='text-xl font-semibold mb-3'>8. Your Rights</h2>
						<p className='text-slate-600 mb-3'>
							Depending on your location, you may have the right to:
						</p>
						<ul className='list-disc pl-5 space-y-2 text-slate-600'>
							<li>Access the personal data we hold about you</li>
							<li>Request correction or deletion</li>
							<li>Object to or restrict processing</li>
							<li>Withdraw consent at any time</li>
						</ul>
					</section>

					<section>
						<h2 className='text-xl font-semibold mb-3'>
							9. Changes to This Policy
						</h2>
						<p className='text-slate-600'>
							We may update this Privacy Policy from time to time. Changes will
							be posted on this page with an updated revision date.
						</p>
					</section>

					<section>
						<h2 className='text-xl font-semibold mb-3'>10. Contact Us</h2>
						<p className='text-slate-600'>
							If you have any questions about this Privacy Policy or how we
							handle your data, please contact us at:
						</p>
						<p className='mt-2 font-medium text-slate-900'>
							support@testorium.com
						</p>
					</section>
				</div>
			</div>
		</main>
	);
}
