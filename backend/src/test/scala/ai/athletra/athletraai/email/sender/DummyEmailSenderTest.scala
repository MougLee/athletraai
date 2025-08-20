package ai.athletra.athletraai.email.sender

import ai.athletra.athletraai.email.EmailData
import ai.athletra.athletraai.test.BaseTest

class DummyEmailSenderTest extends BaseTest:
  it should "send scheduled email" in {
    DummyEmailSender(EmailData("test@sml.com", "subject", "content"))
    DummyEmailSender.findSentEmail("test@sml.com", "subject").isDefined shouldBe true
  }
