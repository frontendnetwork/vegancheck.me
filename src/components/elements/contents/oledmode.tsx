import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

const OLEDMode = () => {
  const t = useTranslations("More");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const setThemeColorAttribute = (color: string) => {
    const themeColorElement = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"][media="(prefers-color-scheme: dark)"]'
    );

    if (themeColorElement) {
      themeColorElement.setAttribute("content", color);
    }
  };

  useEffect(() => {
    const localStorageValue = localStorage.getItem("oled");
    if (
      localStorageValue === "true" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-theme", "oled");
      setThemeColorAttribute("#000");
      setIsChecked(true);
    }
  }, []);

  const handleClick = () => {
    if (
      !isChecked &&
      !window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setError(true);
      return;
    }
    if (!isChecked) {
      document.documentElement.setAttribute("data-theme", "oled");
      setThemeColorAttribute("#000");
      localStorage.setItem("oled", "true");
    } else {
      localStorage.clear();
      document.documentElement.removeAttribute("data-theme");
      setThemeColorAttribute("#141414");
    }
    setIsChecked(!isChecked);
    setError(false);
  };

  return (
    <label htmlFor="oled-switch" className="Grid switcher">
      <div className="Grid-cell description">
        OLED-Mode
        <span className="info" id="cookieinfo">
          {t("thissetsacookie")}
        </span>
        <span
          className={`info ${error ? "animated fadeIn" : ""}`}
          id="oledinfo"
          style={{ display: error ? "block" : "none" }}
        >
          {t("activatedarkmode")}
        </span>
      </div>
      <div className="Grid-cell icons">
        <input
          className={`switch ${error ? "animated shake" : ""}`}
          id="oled-switch"
          type="checkbox"
          checked={isChecked}
          onClick={handleClick}
          onChange={handleClick}
        />
      </div>
    </label>
  );
};

export default OLEDMode;
