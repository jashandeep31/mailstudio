import { getRefineTemplateOverview } from "./ai/mail/refine-template/get-refine-template-overview.js";

export async function test() {
  console.log(`Test is fired 🔥 up `);
  // const res = await refineMailTemplate({
  //   prompt: "Please add the demo image to the template",
  //   brandKit: null,
  //   media: [],
  //   prevMjmlCode: PREV_MTML_CODE,
  // });
  // console.log(res);
  // for await (const chunk of getRefineTemplateOverview(
  //   "please add the logo to the header",
  // )) {
  //   console.log("STREAM:", chunk);
  // }
}

const PREV_MTML_CODE = `<mjml>
  <mj-head>
    <mj-title>Your items are waiting - NovaStore</mj-title>
    <mj-preview>Don't forget your items! Use code TODAY5 for 5% off.</mj-preview>
    <mj-attributes>
      <mj-all font-family="Helvetica, Arial, sans-serif" />
      <mj-text color="#333333" line-height="1.5" />
      <mj-button background-color="#2ECC71" color="#ffffff" border-radius="4px" font-weight="bold" />
      <mj-section padding="0px" />
    </mj-attributes>
    <mj-style>
      .discount-code {
        border: 2px dashed #2ECC71;
        background-color: #f0fcf4;
        padding: 10px 20px;
        display: inline-block;
        border-radius: 4px;
      }
      @media only screen and (max-width:480px) {
        .mobile-padding {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
      }
    </mj-style>
  </mj-head>
  <mj-body background-color="#F8F9FA">
    
    <!-- Preheader / View in Browser -->
    <mj-section padding="20px 0">
      <mj-column>
        <mj-text align="center" font-size="12px" color="#888888">
          Having trouble viewing this email? <a href="https://novastore.com/view-online" style="color:#888888; text-decoration:underline;">View in Browser</a>
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Main Content Wrapper -->
    <mj-wrapper background-color="#ffffff" padding="0px" border-radius="4px">
      
      <!-- Logo Header -->
      <mj-section padding="30px 0 20px">
        <mj-column>
          <mj-image width="180px" src="https://placehold.co/180x50/333333/ffffff?text=NOVASTORE" alt="NovaStore Logo" href="https://novastore.com" />
        </mj-column>
      </mj-section>

      <!-- Hero Section -->
      <mj-section padding="20px 30px">
        <mj-column>
          <mj-text align="center" font-size="26px" font-weight="bold" padding-bottom="15px">
            Your items are waiting for you.
          </mj-text>
          <mj-text align="center" font-size="16px" color="#555555" padding-bottom="25px">
            We noticed you left some great style choices in your cart. Checkout today and get an instant <strong>5% discount</strong> on your entire order.
          </mj-text>
          <mj-text align="center">
            <span class="discount-code" style="font-size: 18px; letter-spacing: 2px; color: #2ECC71;">TODAY5</span>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Cart Summary Divider -->
      <mj-section padding="10px 30px">
        <mj-column>
          <mj-divider border-width="1px" border-color="#eeeeee" />
        </mj-column>
      </mj-section>

      <!-- Product Grid -->
      <mj-section padding="20px">
        <!-- Product 1 -->
        <mj-column width="33.33%" padding="10px">
          <mj-image src="https://placehold.co/150x150/eeeeee/333333?text=T-Shirt" alt="Premium Cotton T-Shirt" border-radius="4px" />
          <mj-text align="center" font-weight="bold" padding-top="15px" font-size="14px">
            Premium Cotton T-Shirt
          </mj-text>
          <mj-text align="center" color="#2ECC71" font-size="14px" padding-top="5px">
            $29.99
          </mj-text>
        </mj-column>
        
        <!-- Product 2 -->
        <mj-column width="33.33%" padding="10px">
          <mj-image src="https://placehold.co/150x150/eeeeee/333333?text=Jeans" alt="Classic Denim Jeans" border-radius="4px" />
          <mj-text align="center" font-weight="bold" padding-top="15px" font-size="14px">
            Classic Denim Jeans
          </mj-text>
          <mj-text align="center" color="#2ECC71" font-size="14px" padding-top="5px">
            $89.50
          </mj-text>
        </mj-column>
        
        <!-- Product 3 -->
        <mj-column width="33.33%" padding="10px">
          <mj-image src="https://placehold.co/150x150/eeeeee/333333?text=Belt" alt="Leather Belt" border-radius="4px" />
          <mj-text align="center" font-weight="bold" padding-top="15px" font-size="14px">
            Leather Belt
          </mj-text>
          <mj-text align="center" color="#2ECC71" font-size="14px" padding-top="5px">
            $45.00
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- CTA Button -->
      <mj-section padding="20px 0 50px">
        <mj-column>
          <mj-button href="https://novastore.com/checkout" font-size="16px" inner-padding="15px 35px">
            Complete Checkout Now
          </mj-button>
        </mj-column>
      </mj-section>

    </mj-wrapper>

    <!-- Footer -->
    <mj-section background-color="#2C3E50" padding="40px 20px">
      <mj-column>
        <mj-social mode="horizontal" icon-size="28px" padding-bottom="20px">
          <mj-social-element name="facebook" href="https://facebook.com/novastore" background-color="#44586d"></mj-social-element>
          <mj-social-element name="instagram" href="https://instagram.com/novastore" background-color="#44586d"></mj-social-element>
          <mj-social-element name="twitter" href="https://twitter.com/novastore" background-color="#44586d"></mj-social-element>
        </mj-social>
        <mj-text align="center" color="#ffffff" font-size="14px">
          <strong>NovaStore</strong><br />
          123 Lifestyle Blvd, Suite 100<br />
          New York, NY 10012
        </mj-text>
        <mj-text align="center" color="#cccccc" font-size="12px" padding-top="20px">
          <a href="#" style="color:#ffffff; text-decoration:underline;">Unsubscribe</a> &nbsp;|&nbsp; <a href="#" style="color:#ffffff; text-decoration:underline;">Privacy Policy</a>
        </mj-text>
      </mj-column>
    </mj-section>
    
    <!-- Spacer for bottom of email -->
    <mj-section padding="20px 0">
    </mj-section>

  </mj-body>
</mjml>`;
