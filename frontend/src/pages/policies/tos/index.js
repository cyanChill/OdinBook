import { useNavigate } from "react-router";
import { IoChevronBackCircle } from "react-icons/io5";

import styles from "../index.module.css";
import Card from "../../../components/ui/card";

const TOSPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.appContainer}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <header>
            <h1 onClick={() => navigate("/policies")} className={styles.back}>
              <IoChevronBackCircle />
              Terms of Service
            </h1>
            <p>
              Last Updated on <b>August 13, 2022</b>.
            </p>
          </header>

          <h2>Definitions</h2>
          <ul>
            {" "}
            <li>
              <b>"Company"</b> (referred to as either <b>"the Company"</b>,{" "}
              <b>"We"</b>, <b>"Us"</b> or <b>"Our"</b> in this Agreement) refers
              to
              <b>cyanChill</b> (creator of this application).
            </li>
            <li>
              <b>"Content"</b> refers to content such as text, images, or other
              information that can be posted, uploaded, linked to or otherwise
              made avaliable by You, regardless of the form of that content.
            </li>
            <li>
              <b>"Service"</b> refers to the Website.
            </li>
            <li>
              <b>"Terms of Service"</b> (also referred as <b>"Terms"</b>) mean
              these Terms of Service that form the entire agreement between You
              and the Company regarding the use of the Service.
            </li>
            <li>
              <b>"Website"</b> refers to <b>OdinWorks</b>, accessible from{" "}
              <b>https://odin-works.netlify.app/login</b>
            </li>
            <li>
              <b>"You"</b> means the individual accessing or using the Service,
              or the company, or other legal entity on behalf of which such
              individual is accesssing or using the Service, as applicable.
            </li>
          </ul>

          <h2>User Accounts</h2>
          <p>
            When you create an account with Us, you may provide us with
            inaccurate information.
          </p>
          <p>
            You are responsible for safeguarding the password that You will use
            to access the Service.
          </p>

          <h2>Content</h2>
          <h3>Your Right to Post Content</h3>
          <p>
            Our Service allows You to post Content. You are responsible for the
            Content that You post to the Service, including its legality,
            reliability, and appropriateness.
          </p>
          <p>
            By posting Content to the Service, You grant Us the right and
            license to use, modify, publicly perform, publicly display,
            reproduce, and distribute such Content on and through the Service.
            You retain any and all of Your rights to any Content You submit,
            post or display on or through the Service and You are responsible
            for protecting those rights. You agree that this license includes
            the right for Us to make Your Content available to other users of
            the Service, who may also use Your Content subject to these Terms.
          </p>
          <p>
            You represent and warrant that: (i) the Content is Yours (You own
            it) or You have the right to use it and grant Us the rights and
            license as provided in these Terms, and (ii) the posting of Your
            Content on or through the Service does not violate the privacy
            rights, publicity rights, copyrights, contract rights or any other
            rights of any person.
          </p>

          <h3>Content Restrictions</h3>
          <p>
            The Company is not responsible for the content of the Service's
            users. You expressly understand and agree that You are solely
            responsible for the Content and for all activity that occurs under
            your account, whether done so by You or any third person using Your
            account.
          </p>
          <p>
            You may not transmit any Content that is unlawful, offensive,
            upsetting, intended to disgust, threatening, libelous, defamatory,
            obscene or otherwise objectionable. Examples of such objectionable
            Content include, but are not limited to, the following:
          </p>
          <ul>
            <li>Unlawful or promoting unlawful activity</li>
            <li>
              Defamatory, discriminatory, or mean-spirited content, including
              references or commentary about religion, race, sexual orientation,
              gender, national/ethnic origin, or other targeted groups.
            </li>
            <li>
              Spam, machine - or randomly - generated, constituting unauthorized
              or unsolicited advertising, chain letters, any other form of
              unauthorized solicitation, or any form of lottery or gambling.
            </li>
            <li>
              Containing or installing any viruses, worms, malware, trojan
              horses, or other content that is designed or intended to disrupt,
              damage, or limit the functioning of any software, hardware or
              telecommunications equipment or to damage or obtain unauthorized
              access to any data or other information of a third person.
            </li>
            <li>
              Infringing on any proprietary rights of any party, including
              patent, trademark, trade secret, copyright, right of publicity or
              other rights
            </li>
            <li>
              Impersonating any person or entity including the Company and its
              employees or representatives. ● Violating the privacy of any third
              person.
            </li>
            <li>Violating the privacy of any third person.</li>
            <li>False information and features.</li>
          </ul>
          <p>
            The Company reserves the right, but not the obligation, to, in its
            sole discretion, determine whether or not any Content is appropriate
            and complies with this Terms, refuse or remove this Content. The
            Company further reserves the right to make formatting and edits and
            change the manner of any Content. The Company can also limit or
            revoke the use of the Service if You post such objectionable
            Content. As the Company cannot control all content posted by users
            and/or third parties on the Service, you agree to use the Service at
            your own risk. You understand that by using the Service You may be
            exposed to content that You may find offensive, indecent, incorrect
            or objectionable, and You agree that under no circumstances will the
            Company be liable in any way for any content, including any errors
            or omissions in any content, or any loss or damage of any kind
            incurred as a result of your use of any content.
          </p>

          <h2>Copyright Policy</h2>
          <h3>Intellectual Property Infringement</h3>
          <p>
            We respect the intellectual property rights of others. It is Our
            policy to respond to any claim that Content posted on the Service
            infringes a copyright or other intellectual property infringement of
            any person.
          </p>
          <p>
            If You are a copyright owner, or authorized on behalf of one, and
            You believe that the copyrighted work has been copied in a way that
            constitutes copyright infringement that is taking place through the
            Service, You must submit Your notice in writing to the attention of
            our copyright agent via email (anthonyliang011@gmail.com) and
            include in Your notice a detailed description of the alleged
            infringement.
          </p>
          <p>
            You may be held accountable for damages (including costs and
            attorneys' fees) for misrepresenting that any Content is infringing
            Your copyright.
          </p>

          <h3>
            DMCA Notice and DMCA Procedure for Copyright Infringement Claims
          </h3>
          <p>
            You may submit a notification pursuant to the Digital Millennium
            Copyright Act (DMCA) by providing our Copyright Agent with the
            following information in writing (see 17 U.S.C 512(c)(3) for further
            detail):
          </p>
          <ul>
            <li>
              An electronic or physical signature of the person authorized to
              act on behalf of the owner of the copyright's interest.
            </li>
            <li>
              A description of the copyrighted work that You claim has been
              infringed, including the URL (i.e., web page address) of the
              location where the copyrighted work exists or a copy of the
              copyrighted work.
            </li>
            <li>
              Identification of the URL or other specific location on the
              Service where the material that You claim is infringing is
              located.
            </li>
            <li>Your address, telephone number, and email address.</li>
            <li>
              A statement by You that You have a good faith belief that the
              disputed use is not authorized by the copyright owner, its agent,
              or the law.
            </li>
            <li>
              A statement by You, made under penalty of perjury, that the above
              information in Your notice is accurate and that You are the
              copyright owner or authorized to act on the copyright owner's
              behalf
            </li>
          </ul>
          <p>
            You can contact our copyright agent via email
            (anthonyliang011@gmail.com). Upon receipt of a notification, the
            Company will take whatever action, in its sole discretion, it deems
            appropriate, including removal of the challenged content from the
            Service.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            The Service and its original content (excluding Content provided by
            You or other users), features and functionality are and will remain
            the exclusive property of the Company and its licensors.
          </p>
          <p>
            The Service is protected by copyright, trademark, and other laws of
            both the Country and foreign countries
          </p>
          <p>
            Our trademarks and trade dress may not be used in connection with
            any product or service without the prior written consent of the
            Company.
          </p>

          <h2>Termination</h2>
          <p>
            We may terminate or suspend Your Account immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if You breach these Terms of Service.
          </p>
          <p>
            Upon termination, Your right to use the Service will cease
            immediately. If You wish to terminate Your Account, You may simply
            discontinue using the Service
          </p>

          <h2>Changes to These Terms of Service</h2>
          <p>
            We reserve the right, at Our sole discretion, to modify or replace
            these Terms at any time. If a revision is material We will make
            reasonable efforts to provide at least 30 days' notice prior to any
            new terms taking effect. What constitutes a material change will be
            determined at Our sole discretion.
          </p>
          <p>
            By continuing to access or use Our Service after those revisions
            become effective, You agree to be bound by the revised terms. If You
            do not agree to the new terms, in whole or in part, please stop
            using the website and the Service.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default TOSPage;
