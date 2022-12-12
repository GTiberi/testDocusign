const docusign = require('docusign-esign');
const fs = require('fs');

const { OAuthToken } = docusign.AuthenticationApi;
const { BrandApi } = docusign.BrandApi;

// enter your integration key, email, and password here:
const INTEGRATOR_KEY = 'your-integration-key';
const EMAIL = 'your-email';
const PASSWORD = 'your-password';

// set up the authentication client
const authClient = new OAuthToken({}, INTEGRATOR_KEY);
authClient.apiClient.authenticate(
	{
		username: EMAIL,
		password: PASSWORD,
		integratorKey: INTEGRATOR_KEY,
	},
	(error, loginInfo) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		// set up the brand client
		const brandClient = new BrandApi({}, loginInfo.basePath);

		// download the brand resource file
		brandClient.getBrandResources(
			loginInfo.accountId,
			(error, brandResources) => {
				if (error) {
					console.error(error);
					process.exit(1);
				}

				// write the brand resource file to disk
				fs.writeFileSync(
					'docusign-brand-resources.zip',
					brandResources.brandResourcesZipBytes,
					'binary'
				);
			}
		);
	}
);
