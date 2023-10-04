import React from "react";

const PrivacyPolicy = (props) => {
  return (
    <>
      <style>
        {`
          body {
            background-color: #fff;
            color:#444;
            line-height:1.7;
          }
          .page-title{
            font-size:32px;
            font-weight:bold;
          }
          .title{
            font-size:26px;             
            font-weight:bold; 
          }
          .sub-title{
            font-size:18px; 
            font-weight:bold;           
          }
         
          
        `}
      </style>
      <div
        className="container-fluid"
        style={{ textAlign: "left", fontSize: "16px" }}
      >
        <div className="page-title mb-2">Privacy Policy</div>

        <strong>Last updated January 05, 2023</strong>
        <br />
        <div className="mt-3">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. <strong>Lorem Ipsum</strong> has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book.
        </div>
        <div className="sub-title"> Lorem Ipsum</div>
        <div>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </div>
        <div className="sub-title"> Lorem Ipsum</div>
        <strong> Lorem Ipsum: Lorem Ipsum</strong>
        <div>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </div>
        <ul>
          <li> Lorem Ipsum</li>
          <li> Lorem Ipsum</li>
        </ul>
        <strong> Lorem Ipsum : </strong>
        <span>Lorem Ipsum is simply dummy text</span>

        <div className="sub-title">Table of contents</div>
        <div>
          <div>
            <a href="#item1">1.What Information do we collect</a>
          </div>
          <div>
            <a href="#item2">2.What Information do we collect</a>
          </div>
          <div>
            <a href="#item3">3.What Information do we collect</a>
          </div>
        </div>

        <div id="item1">
          <div className="sub-title">Title</div>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. <strong>Lorem Ipsum</strong> has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has
          survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of <a href="/">Lorem Ipsum.</a>
          <div>
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor
            at Hampden-Sydney College in Virginia, looked up one of the more
            obscure Latin words, consectetur, from a Lorem Ipsum passage, and
            going through the cites of the word in classical literature,
            discovered the undoubtable source. Lorem Ipsum comes from sections
            1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
            of Good and Evil) by Cicero, written in 45 BC. This book is a
            treatise on the theory of ethics, very popular during the
            Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
            amet..", comes from a line in section 1.10.32.
          </div>
        </div>
        <div id="item2">
          <div className="sub-title">Title</div>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. <strong>Lorem Ipsum</strong> has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has
          survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of <a href="/">Lorem Ipsum.</a>
        </div>
        <div id="item3">
          <div className="sub-title">Title</div>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. <strong>Lorem Ipsum</strong> has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has
          survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of <a href="/">Lorem Ipsum.</a>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
