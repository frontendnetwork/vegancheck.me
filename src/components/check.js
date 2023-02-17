import React, { useState, useEffect, useRef } from "react";
import Scan from "./Scanner/scanner";
import Image from "next/image";
import ModalWrapper from "@/components/elements/modalwrapper";
import ShareButton from "@/components/elements/share";
import { useTranslations } from 'next-intl';

const ProductSearch = () => {
  const t = useTranslations('Check');
  const formRef = useRef(null);
  const [result, setResult] = useState({});
  const [sources, setSources] = useState({});
  const [barcode, setBarcode] = useState("");
  const [showFound, setShowFound] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showTimeoutFinal, setShowTimeoutFinal] = useState(false);
  const [loading, setLoading] = useState(false);

  /* EAN from URL for iOS Shortcut */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eanFromURL = params.get("ean");
    if (eanFromURL) {
      setBarcode(eanFromURL);
      handleSubmit(eanFromURL);
    }
  }, []);

  /* Submitting */
  const handleSubmit = (barcode, e = {}) => {
    e.preventDefault && e.preventDefault();
    setShowTimeoutFinal(false);
    setShowTimeout(false);
    setShowFound(false);
    setShowNotFound(false);
    setShowInvalid(false);

    setLoading(true);
    fetch(`https://api.vegancheck.me/v0/product/${barcode}`, {
      method: "POST",
      timeout: 8000,
    })
      .then((res) => {
        setShowTimeout(false);

        return res.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.status === 200) {
          setResult(data.product);
          setSources(data.sources);
          setShowFound(true);
          setShowTimeout(false);
        } else if (data.status === 400) {
          setShowNotFound(true);
          setShowTimeout(false);
        } else {
          setShowInvalid(true);
          setShowTimeout(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setShowTimeoutFinal(true);
        setShowTimeout(false);
      });
  };

  const handleChange = (e) => {
    setBarcode(e.target.value);
  };

  let productname = result.productname === "n/a" ? "?" : result.productname;
  let vegan =
    result.vegan === "true"
      ? "vegan icon-ok"
      : result.vegan === "false"
      ? "non-vegan icon-cancel"
      : "unknown icon-help";
  let vegetarian =
    result.vegetarian === "true"
      ? "vegan icon-ok"
      : result.vegetarian === "false"
      ? "non-vegan icon-cancel"
      : "unknown icon-help";
  let animaltestfree =
    result.animaltestfree === "true"
      ? "vegan icon-ok"
      : result.animaltestfree === "false"
      ? "non-vegan icon-cancel"
      : "unknown icon-help";
  let palmoil =
    result.palmoil === "true"
      ? "non-vegan icon-cancel"
      : result.palmoil === "false"
      ? "vegan icon-ok"
      : "unknown icon-help";
  let nutriscore = result.nutriscore;
  let grade = result.grade;
  let api = sources.api;
  let uri = sources.baseuri;

  if (nutriscore === "n/a") {
    nutriscore = "unknown icon-help";
  } else if (nutriscore === "a") {
    nutriscore = "nutri_a icon-a";
  } else if (nutriscore === "b") {
    nutriscore = "nutri_b icon-b";
  } else if (nutriscore === "c") {
    nutriscore = "nutri_c icon-c";
  } else if (nutriscore === "d") {
    nutriscore = "nutri_d icon-d";
  } else if (nutriscore === "e") {
    nutriscore = "nutri_e icon-e";
  }

  if (grade === "n/a") {
    grade = "unknown icon-help";
  } else if (grade === "A") {
    grade = "nutri_a icon-a";
  } else if (grade === "B") {
    grade = "nutri_b icon-b";
  } else if (grade === "C") {
    grade = "nutri_c icon-c";
  } else if (grade === "D") {
    grade = "nutri_d icon-d";
  } else if (grade === "A+") {
    grade = "nutri_a icon-a";
  } else if (grade === "Not eligible") {
    grade = "non-vegan icon-cancel";
  }

  return (
    <>
      <Image
        src="/./img/VeganCheck.svg"
        alt="Logo"
        className={`logo ${loading ? "spinner" : ""}`}
        width={48}
        height={48}
      />
      <form
        ref={formRef}
        id="eanform"
        onSubmit={(e) => handleSubmit(barcode, e)}
      >
        <legend>{t('enterbarcode')}</legend>
        <fieldset>
          <Scan
            onDetected={(barcode) => setBarcode(barcode)}
            handleSubmit={handleSubmit}
          />
          <input
            type="number"
            name="barcode"
            placeholder={t('enterbarcode')}
            autoFocus={true}
            value={barcode}
            onChange={handleChange}
          />
          <button name="submit" aria-label={t('submit')} role="button">
            <span className="icon-right-open" />
          </button>
        </fieldset>
      </form>
      {showFound && (
        <>
          <div id="result">
            <div className="animated fadeIn resultborder" id="RSFound">
              <span className="unknown">
                <span className="name" id="name_sh">
                  {productname}
                </span>
              </span>
              <span id="result_sh">
                <div className="Grid">
                  <div className="Grid-cell description">{t('vegan')}</div>
                  <div className="Grid-cell icons RSVegan">
                    <span className={vegan}></span>
                  </div>
                </div>
              </span>
              <div className="Grid">
                <div className="Grid-cell description">{t('vegetarian')}</div>
                <div className="Grid-cell icons RSVegetarian">
                  <span className={vegetarian}></span>
                </div>
              </div>
              <div className="Grid">
                <div className="Grid-cell description">
                {t('palmoil')}
                  <ModalWrapper
                    id="palmoil"
                    buttonType="sup"
                    buttonClass="help-icon"
                    buttonText="?"
                  >
                    <span className="center">
                      <Image
                        src="../img/palmoil_img.svg"
                        className="heading_img"
                        alt="Palmoil"
                        width={48}
                        height={48}
                      />
                      <h1>{t('palmoil')}</h1>
                    </span>
                    <p>
                    {t('palmoil_desc')}
                    </p>
                  </ModalWrapper>
                </div>
                <div className="Grid-cell icons RSPalmoil">
                  <span className={palmoil}></span>
                </div>
              </div>
              <div className="Grid Crueltyfree" style={animaltestfree === "unknown icon-help" ? {display: "none"} : {}}>
                <div className="Grid-cell description">{t('crueltyfree')}</div>
                <div className="Grid-cell icons RSAnimaltestfree">
                  <span className={animaltestfree}></span>
                </div>
              </div>
              <div className="Grid">
                <div className="Grid-cell description">
                  Nutriscore
                  <ModalWrapper
                    id="nutriscore"
                    buttonType="sup"
                    buttonClass="help-icon"
                    buttonText="?"
                  >
                    <span className="center">
                      <Image
                        src="../img/nutriscore_image.svg"
                        className="heading_img"
                        alt="Nutriscore"
                        width={48}
                        height={48}
                      />
                      <h1>Nutriscore</h1>
                    </span>
                    <p dangerouslySetInnerHTML={{ __html: t('nutriscore_desc', {Algorithmwatch: '<a href="https://algorithmwatch.org/en/nutriscore/">Algorithmwatch</a>'})}} />
                  </ModalWrapper>
                </div>
                <div className="Grid-cell icons RSNutriscore">
                  <span className={nutriscore}></span>
                </div>
              </div>
              <div className="Grid">
                <div className="Grid-cell description">
                  Grade
                  <ModalWrapper
                    id="grade"
                    buttonType="sup"
                    buttonClass="help-icon"
                    buttonText="?"
                  >
                    <span className="center">
                      <Image
                        src="../img/grade_img.svg"
                        className="heading_img"
                        alt="Grades"
                        width={48}
                        height={48}
                      />
                      <h1>Grades</h1>
                    </span>
                    <p dangerouslySetInnerHTML={{ __html: t('grades_desc', {Grades: '<a href="https://grade.vegancheck.me">VeganCheck Grades</a>'})}} />
                    <span className="center">
                      <a href="https://grade.vegancheck.me" className="button">VeganCheck Grades</a>
                    </span>
                  </ModalWrapper>
                </div>
                <div className="Grid-cell icons RSGrade">
                  <span className={grade}></span>
                </div>
              </div>
              <span className="source">
              {t('source')}:{" "}
                <a href={uri} className="RSSource" target="_blank">
                  {api}
                </a>
                <ModalWrapper
                  id="license"
                  buttonType="sup"
                  buttonClass="help-icon"
                  buttonText="?"
                >
                  <span className="center">
                    <Image
                      src="../img/license_img.svg"
                      className="heading_img"
                      alt="Licenses"
                      width={48}
                      height={48}
                    />
                    <h1>{t('licenses')}</h1>
                  </span>
                  <p>
                  {t('licenses_desc')}
                  </p>
                  <p>
                    &copy; OpenFoodFacts Contributors, licensed under{" "}
                    <a href="https://opendatacommons.org/licenses/odbl/1.0/">
                      Open Database License
                    </a>{" "}
                    and{" "}
                    <a href="https://opendatacommons.org/licenses/dbcl/1.0/">
                      Database Contents License
                    </a>
                    .<br />
                    &copy; Open EAN/GTIN Database Contributors, licensed under{" "}
                    <a href="https://www.gnu.org/licenses/fdl-1.3.html">
                      GNU FDL
                    </a>
                    .<br />
                    &copy; VeganCheck.me Contributors and Hamed Montazeri,
                    licensed under{" "}
                    <a href="https://github.com/JokeNetwork/vegan-ingredients-api/blob/master/LICENSE">
                      MIT License
                    </a>
                    , sourced from{" "}
                    <a href="https://www.veganpeace.com/ingredients/ingredients.htm">
                      VeganPeace
                    </a>
                    ,{" "}
                    <a href="https://www.peta.org/living/food/animal-ingredients-list/">
                      PETA
                    </a>{" "}
                    and{" "}
                    <a href="http://www.veganwolf.com/animal_ingredients.htm">
                      The VEGAN WOLF
                    </a>
                    .<br />
                    &copy; VeganCheck.me Contributors, sourced from ©{" "}
                    <a href="https://crueltyfree.peta.org">
                      PETA (Beauty without Bunnies)
                    </a>
                    .
                  </p>
                </ModalWrapper>
              </span>
              <ShareButton productName={productname} barcode={barcode} />
            </div>
          </div>
        </>
      )}
      {showNotFound && (
        <div id="result">
          <div className="animated fadeIn resultborder" id="RSNotFound">
            <span>
            {t('notindb')}
            </span>
            <p className="missing" style={{ textAlign: "center" }}>
            {t('notindb_add')}{" "}
              <a
                href="https://world.openfoodfacts.org/cgi/product.pl"
                target="_blank"
              >
                {t('add_food')}
              </a>{" "}
              {t('or')}{" "}
              <a
                href="https://world.openbeautyfacts.org/cgi/product.pl"
                target="_blank"
              >
                {t('add_cosmetic')}
              </a>
              .
            </p>
          </div>
        </div>
      )}
      {showInvalid && (
        <div id="result">
          <div className="animated fadeIn resultborder" id="RSInvalid">
            <span>{t('wrongbarcode')}</span>
          </div>
        </div>
      )}
      {showTimeout && (
        <div className="timeout animated fadeIn">
          {t('timeout1')}<span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      )}
      {showTimeoutFinal && (
        <div className="timeout-final animated fadeIn">
         {t('timeout2')}
        </div>
      )}
    </>
  );
};

export default ProductSearch;
