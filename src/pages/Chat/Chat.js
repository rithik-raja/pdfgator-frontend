import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Chat.css";
import Dropzone, { useDropzone } from "react-dropzone";
import * as Icon from "react-feather";
import PdfView from "../../components/PdfView/PdfView";
import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { GET_FILES, SET_FILES } from "../../constants/apiConstants";
import { get, post } from "../../components/Api/api";
import { uploadFileToApi } from "../../services/fileUploadService";
import { getSessionId } from "../../services/sessionService";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const [uploadedUrl, setuploadedUrl] = useState("");
  const [uploadedFile, setuploadedFile] = useState(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
  });
  const [pdfLists, setpdfLists] = useState([]);
  const [areas, setareas] = useState({
    bboxes: [
      {
        pageIndex: 78,
        left: 55.50444359872856,
        top: 63.50954614504419,
        width: 24.763643352034826,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 78,
        left: 12.58042404075074,
        top: 65.59287947837753,
        width: 73.44095940683403,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 78,
        left: 12.58042404075074,
        top: 67.67621281171085,
        width: 62.924512227376304,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 78,
        left: 12.58042404075074,
        top: 69.7595461450442,
        width: 22.533166174795113,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 78,
        left: 76.3083813237209,
        top: 76.0095461450442,
        width: 2.403967364940768,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 78,
        left: 12.58042404075074,
        top: 78.09287947837753,
        width: 72.87310307321985,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 78,
        left: 12.58042404075074,
        top: 80.17621281171085,
        width: 68.02751005085466,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 78,
        left: 12.58042404075074,
        top: 82.2595461450442,
        width: 72.17813005634383,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 78,
        left: 12.58042404075074,
        top: 84.34287947837753,
        width: 69.26766065211078,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 78,
        left: 12.58042404075074,
        top: 86.42621281171085,
        width: 70.6140443390491,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 28.755696614583332,
        width: 66.15250905354819,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 30.839029947916668,
        width: 69.37212351880042,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 32.92236328125,
        width: 71.12798628464245,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 35.00569661458333,
        width: 64.7578507467033,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 37.08902994791667,
        width: 66.45932540394901,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 39.17236328125,
        width: 71.178130854189,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 41.25569661458333,
        width: 70.43193617677377,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 43.33902994791667,
        width: 74.15249768425437,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 45.42236328125,
        width: 69.92695004332299,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 47.50569661458333,
        width: 72.05654842401643,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 49.58902994791667,
        width: 74.13613188500497,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 51.67236328125,
        width: 69.44152607637292,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 53.755696614583336,
        width: 72.35251906650518,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 55.839029947916664,
        width: 70.14269236645667,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 57.92236328125,
        width: 73.98008334091286,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 60.005696614583336,
        width: 74.26554237315858,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 62.089029947916664,
        width: 66.20933557647506,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 64.17236328125,
        width: 69.20567306817746,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 66.25569661458334,
        width: 60.645073535395596,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 68.33902994791666,
        width: 72.54332374123966,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 70.42236328125,
        width: 60.10915594163284,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 72.50569661458334,
        width: 70.81472234788284,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 74.58902994791666,
        width: 66.74788107279859,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 81,
        left: 12.58042404075074,
        top: 76.67236328125,
        width: 73.38121077593635,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 14.17236328125,
        width: 67.56159838508157,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 16.255696614583336,
        width: 42.72434384215112,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 65.60739255418964,
        top: 37.08902994791667,
        width: 10.00097935495813,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 39.17236328125,
        width: 74.13759792552274,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 41.25569661458333,
        width: 73.06879454968023,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 43.33902994791667,
        width: 73.95133099524803,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 45.42236328125,
        width: 63.889271605248545,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 47.50569661458333,
        width: 72.60638342963325,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 49.58902994791667,
        width: 73.66006763931972,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 51.67236328125,
        width: 73.74321308011324,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 53.755696614583336,
        width: 72.42681839886833,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 55.839029947916664,
        width: 69.01324777042164,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 57.92236328125,
        width: 66.70055389404297,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 60.005696614583336,
        width: 69.66869753170637,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 62.089029947916664,
        width: 26.403268801620584,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 65.1193329782197,
        width: 74.3612837947272,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 67.20266631155303,
        width: 68.41230080797781,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 69.28599964488636,
        width: 74.82648737290326,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 82,
        left: 12.58042404075074,
        top: 71.3693329782197,
        width: 72.65327678007239,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 47.048571218852125,
        top: 9.058726917613637,
        width: 30.000524583205678,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 11.142060250946969,
        width: 68.8559326471067,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 13.225393584280305,
        width: 72.89248073802274,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 15.308726917613635,
        width: 72.87533703972312,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 17.39206025094697,
        width: 73.72338662739672,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 19.475393584280305,
        width: 72.19657025306053,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 21.558726917613637,
        width: 70.19396389231962,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 23.64206025094697,
        width: 68.31916235630808,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 25.725393584280305,
        width: 64.51918533424926,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 27.808726917613637,
        width: 70.84609262304369,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 29.892060250946972,
        width: 69.15491515514898,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 31.975393584280305,
        width: 63.8517978144627,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 34.05872691761363,
        width: 71.51258755353541,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 36.14206025094697,
        width: 64.94886984232984,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 38.225393584280305,
        width: 62.99641802420024,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 40.30872691761363,
        width: 74.11617578244677,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 42.39206025094697,
        width: 70.53974999321831,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 44.475393584280305,
        width: 74.35741424560547,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 46.55872691761363,
        width: 74.24299327376622,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 48.64206025094697,
        width: 71.16947423398884,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 12.58042404075074,
        top: 50.7253935842803,
        width: 32.39101210450814,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 14.451211418201721,
        top: 55.64963600852273,
        width: 19.939705593134065,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 18.12768325307011,
        top: 59.62690873579546,
        width: 65.56427151549096,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 18.12768325307011,
        top: 61.71024206912878,
        width: 67.06649431216172,
        height: 2.1519516453598486,
      },
      {
        pageIndex: 86,
        left: 18.12768325307011,
        top: 63.793575402462125,
        width: 12.489007189382914,
        height: 2.1519516453598486,
      },
    ],
    indices: [0, 4, 10, 34, 36, 53],
  });
  const fileInputOnChange = async (acceptedFiles) => {
    // const acceptedFiles = e.target.files;
    if (acceptedFiles.length > 0) {
      const newuploadedFile = acceptedFiles[0];
      setuploadedUrl(URL.createObjectURL(newuploadedFile));
      setuploadedFile(newuploadedFile);
      const response = await uploadFileToApi(newuploadedFile);
      if (response && response.data && response.data.id) {
        console.log(response);
        const name = response.data.file_path.split("/").pop() ?? "undefined";
        const newurl = String(response.data.id);
        const newpdflist = [
          ...pdfLists,
          {
            ...response.data,
            name: name,
            url: newurl,
            isActive: "true",
          },
        ];
        setpdfLists(newpdflist);
        setActivepdfList(newurl, newpdflist);
        navigate("/chat/" + String(response.data.id));
      }
    }
  };

  const { pdfid } = params;

  const getPdfLists = async () => {
    const response1 = await get(GET_FILES);
    console.log(response1.data);

    if (response1 && response1.data && response1.data.length) {
      const session_id = getSessionId();
      const response = response1.data.filter((obj) => {
        return obj.session_id === session_id;
      });
      let newlist = response;
      newlist = newlist.map((d, i) => ({
        ...d,
        name: d.file_path.split("/").pop() ?? "undefined",
        url: String(d.id),
      }));

      console.log(newlist);
      const index = newlist.findIndex((object) => {
        return object.url === pdfid;
      });
      if (index > -1) {
        newlist[index].isActive = "true";
        setuploadedUrl(newlist[index].file_path);
      }
      // else {
      //   newlist = [
      //     ...newlist,
      //     { name: pdfid, url: pdfid, isActive: "true" },
      //   ];
      // }
      setpdfLists(newlist);
    }
  };
  const setActivepdfList = (urlName, allpdflists) => {
    const currentUrl = urlName ?? pdfid;
    if (currentUrl.length) {
      const index = allpdflists.findIndex((object) => {
        return object.url === currentUrl;
      });
      if (index > -1) {
        let pdflists = allpdflists.map((e) => ({ ...e, isActive: "false" }));
        pdflists[index].isActive = "true";
        setpdfLists(pdflists);
      }
    }
  };

  useEffect(() => {
    if (!pdfLists.length) getPdfLists();
  }, []);

  const handlePdfLinkClick = (index) => {
    let pdflists = pdfLists.map((e) => ({ ...e, isActive: "false" }));
    pdflists[index].isActive = "true";
    setpdfLists(pdflists);
    setuploadedUrl(pdflists[index].file_path);
  };

  const scrollToBottom = () => {
    const chat = document.getElementById("chatList");
    chat.scrollTop = chat.scrollHeight;
  };

  return (
    <>
      <header>
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar bg-dark">
          <div className="position-sticky">
            <div className="upload-section text-white">
              <Dropzone
                onDrop={(acceptedFiles) => fileInputOnChange(acceptedFiles)}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <span className="fs-5">New File</span>
                      <input {...getInputProps()} />
                      <p className="d-none d-sm-block small">Drop PDF </p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
            <ul className="nav nav-pills flex-column mb-auto">
              {pdfLists.map((list, index) => (
                <li className="nav-item" key={index}>
                  <Link
                    className={
                      "nav-link " +
                      (list.isActive === "true" ? "active" : "text-white")
                    }
                    onClick={(event) => handlePdfLinkClick(index)}
                    // data-bs-toggle="collapse"
                    // data-bs-target="#sidebarMenu"
                    aria-current="true"
                    to={"/chat/" + list.url}
                  >
                    <Icon.FileText />
                    {list.name}
                  </Link>
                </li>
              ))}
              <div style={{ height: "50px" }}></div>
              <li className="nav-item ">
                <div className="alert alert-light footer-nav" role="alert">
                  <Link className="alert-link" to="/">
                    Signin
                  </Link>{" "}
                  to save chat history
                </div>
              </li>
            </ul>
            <hr />
          </div>
        </nav>
        <nav
          id="main-navbar"
          className="navbar navbar-expand-lg navbar-light fixed-top p-0"
        >
          <div className="container-fluid">
            <button
              className="navbar-toggler navbar-icon"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            {/* <div class="navbar-brand d-md-none d-lg-none" href="#">
              Pgfhf
            </div> */}
          </div>
        </nav>
      </header>

      <main>
        <PdfView fileUrl={uploadedUrl} areas={areas} pdfLists={pdfLists} />
      </main>
    </>
  );
};

export default Chat;
