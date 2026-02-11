import { chatVersionOutputsTable, db } from "@repo/db";
import mjml2html from "mjml";

export async function test() {
  const response = mjml2html(mjml, {
    keepComments: false,
    validationLevel: "strict",
  });
  console.log("errors", response.errors);
  console.log(`Test is working `);
}

const mjml = `<mjml>
  <mj-head>
    <mj-title>You made your first sale!</mj-title>
    <mj-preview>Congratulations on your first sale! Check out your earnings inside.</mj-preview>
    <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"></mj-font>
    <mj-attributes>
      <mj-all font-family="Roboto, Helvetica, Arial, sans-serif"></mj-all>
      <mj-text font-size="16px" color="#1A1A1A" line-height="24px"></mj-text>
      <mj-section padding="0px"></mj-section>
      <mj-button background-color="#0055FF" color="#ffffff" font-weight="bold" border-radius="4px" font-size="16px" inner-padding="12px 24px"></mj-button>
    </mj-attributes>
    <mj-style>
      .link-nostyle { color: inherit; text-decoration: none; }
      .footer-link { color: #555555; text-decoration: underline; }
    </mj-style>
  </mj-head>
  <mj-body background-color="#F4F6F8">
    
    <!-- Spacing -->
    <mj-section padding="20px 0"></mj-section>

    <!-- Header -->
    <mj-section background-color="#ffffff" padding="40px 20px 20px 20px" border-radius="8px 8px 0 0">
      <mj-column>
        <mj-image src="https://public.mailstudio.dev/brandkit/logos/d1ee7e7f-d2e2-40c2-9c34-f88500aa0699-mailstudio.png" alt="Mail Studio" width="40px" height="40px" href="https://mailstudio.dev"></mj-image>
      </mj-column>
    </mj-section>

    <!-- Hero Section -->
    <mj-section background-color="#ffffff" padding="20px 20px 10px 20px">
      <mj-column>
        <mj-text align="center" font-size="36px" font-weight="700" color="#0055FF" line-height="40px">
          🎉 Cha-Ching!
        </mj-text>
        <mj-text align="center" font-size="20px" font-weight="500" color="#1A1A1A" padding-top="10px">
          You just made your first sale!
        </mj-text>
        <mj-text align="center" color="#555555" padding-top="10px">
          Congratulations! A customer just purchased one of your email templates. This is the start of something big.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Transaction Summary -->
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column width="80%" background-color="#F8FAFC" border-radius="8px" border="1px solid #E2E8F0">
        <mj-table padding="20px">
          <tr style="border-bottom:1px solid #E2E8F0; text-align:left;">
            <th style="padding: 0 0 10px 0; color:#555555; font-weight:500;">Item</th>
            <th style="padding: 0 0 10px 0; color:#555555; font-weight:500; text-align:right;">Earnings</th>
          </tr>
          <tr>
            <td style="padding: 10px 0 0 0; color:#1A1A1A; font-weight:bold;">SaaS Onboarding Kit</td>
            <td style="padding: 10px 0 0 0; color:#1A1A1A; font-weight:bold; text-align:right;">$1.00</td>
          </tr>
        </mj-table>
      </mj-column>
    </mj-section>

    <!-- Encouragement & Body -->
    <mj-section background-color="#ffffff" padding="10px 20px 30px 20px">
      <mj-column width="90%">
        <mj-text align="center" color="#555555">
          Your creativity is paying off. The marketplace is looking for high-quality designs just like yours. Why not keep the momentum going by uploading your next masterpiece today?
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Call to Action -->
    <mj-section background-color="#ffffff" padding="0px 20px 50px 20px" border-radius="0 0 8px 8px">
      <mj-column>
        <mj-button href="https://mailstudio.dev" width="220px">
          View Your Dashboard
        </mj-button>
      </mj-column>
    </mj-section>

    <!-- Spacing -->
    <mj-section padding="20px 0"></mj-section>

    <!-- Footer -->
    <mj-section background-color="#ffffff" padding="40px 20px">
      <mj-column>
        <mj-text align="center" color="#555555" font-size="12px" line-height="18px">
          &copy; 2026 Mail Studio. All rights reserved.
        </mj-text>
        
        <mj-text align="center" color="#555555" font-size="12px" line-height="18px" padding-top="5px">
          <a href="https://mailstudio.dev" class="footer-link">View in Browser</a> &nbsp;|&nbsp; 
          <a href="https://mailstudio.dev" class="footer-link">Unsubscribe</a>
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Spacing -->
    <mj-section padding="20px 0"></mj-section>

  </mj-body>
</mjml>`;
