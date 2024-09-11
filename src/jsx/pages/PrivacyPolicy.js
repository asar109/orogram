import React from "react";
import { Card } from "react-bootstrap";

function PrivacyPolicy(props) {
  return (
    <>
      <Card>
        <Card.Body>
          <div className="container termsprivacy">
            <div className="row">
              <div className="col-md-12">
                <div className="terms">
                  <h1 style={{ display: "flex", justifyContent: "center" }}>
                    Privacy Policy for Prime Crypto Exchange:
                  </h1>
                  <p>
                    Prime Crypto Exchange (hereinafter referred to as "we,"
                    "us," or "our") is committed to protecting the privacy of
                    our users (hereinafter referred to as "you" or "the user").
                    This privacy policy (hereinafter referred to as the
                    "Policy") explains how we collect, use, and disclose your
                    personal information in connection with your use of the
                    Prime Crypto Exchange platform (hereinafter referred to as
                    "the platform").
                  </p>
                  <h3>1. Information We Collect:</h3>
                  <p>
                    We do not implement "Know Your Client"(KYC) and do not
                    require any personal information from you in order to use
                    the platform.However, we may collect certain non - personal
                    information, such as device information, IP address, and
                    usage data, in order to improve the functionality and
                    security of the platform.
                  </p>

                  <h3>2. Use of Information:</h3>
                  <p>
                    We use the information we collect for the following
                    purposes:
                  </p>
                  <ul>
                    <li>
                      To provide and improve the functionality of the platform;
                    </li>
                    <li>To prevent fraud and other illegal activities;</li>
                    <li>To comply with applicable laws and regulations;</li>
                    <li>
                      To communicate with you about your use of the platform.
                    </li>
                  </ul>

                  <h3>3. Disclosure of Information:</h3>
                  <p>
                    We do not share your personal information with any third
                    party, except as required by applicable law or to comply
                    with legal process.We may also disclose your personal
                    information to law enforcement or other government agencies
                    if we believe it is necessary to prevent or investigate
                    fraud or other illegal activities.
                  </p>
                  <h3>4. Security:</h3>
                  <p>
                    We take reasonable measures to protect the security of your
                    personal information, including implementing technical and
                    organizational measures to prevent unauthorized access, use,
                    or disclosure. However, no security measures are 100%
                    effective, and we cannot guarantee the security of your
                    personal information.
                  </p>
                  <h3>5. Third-Party Websites:</h3>
                  <p>
                    The platform may contain links to third-party websites or
                    services that are not owned or controlled by us. We are not
                    responsible for the privacy practices or content of these
                    third-party websites or services.
                  </p>
                  <h3>6. Children's Privacy:</h3>
                  <p>
                    The platform is not intended for use by children under the
                    age of 18, and we do not knowingly collect personal
                    information from children under the age of 18. If you are
                    under the age of 18, you should not use the platform.
                  </p>
                  <h3>7. Changes to the Policy:</h3>
                  <p>
                    We may update this Policy from time to time. If we make any
                    material changes to this Policy, we will notify you by
                    posting a notice on the platform. Your continued use of the
                    platform after we post any changes to this Policy will
                    constitute your acceptance of those changes.
                  </p>
                  <h3>8. Contact Us:</h3>
                  <p>
                    If you have any questions about this Policy, please contact
                    us at{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
export default PrivacyPolicy;
