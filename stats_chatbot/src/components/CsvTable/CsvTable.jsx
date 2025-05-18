import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import styles from '../CsvTable/CsvTable.module.css';

const CsvTable = () => {
  const [data, setData] = useState([]);

  const headers = [
    { key: "SOS", label: "SOS" },
    { key: "NET", label: "NET" },
    { key: "Offensive Rating", label: "Offensive Rating" },
    { key: "Defensive Rating", label: "Defensive Rating" },
    { key: "EFG", label: "EFG" },
    { key: "TS%", label: "TS%" },
    { key: "ORB%", label: "ORB%" },
    { key: "DRB%", label: "DRB%" },
    { key: "TRB%", label: "TRB%" },
    { key: "AST%", label: "AST%" },
    { key: "STL%", label: "STL%" },
    { key: "BLK%", label: "BLK%" },
    { key: "PACE", label: "PACE" },
    { key: "3PAR", label: "3PAR" },
    { key: "FTAR", label: "FTAR" },
    { key: "PPG", label: "PPG" },
    { key: "FG%", label: "FG%" },
    { key: "2FG%", label: "2FG%" },
    { key: "3FG%", label: "3FG%" },
    { key: "FT%", label: "FT%" },
    { key: "APG", label: "APG" },
    { key: "AST-TOV", label: "AST-TOV" },
    { key: "Allowed_PPG", label: "PPG Allowed" },
    { key: "Allowed_FG%", label: "FG% Allowed" },
    { key: "2Point_Allowed_FG%", label: "2 point FG% Allowed" },
    { key: "3Point_Allowed_FG%", label: "3 point FG% Allowed" },
    { key: "SPG", label: "SPG" },
    { key: "BPG", label: "BPG" },
    { key: "Fouls", label: "Fouls" },
    { key: "ADJOE", label: "ADJOE" },
    { key: "ADJDE", label: "ADJDE" },
    { key: "BARTHAG", label: "BARTHAG" },
    { key: "WAB", label: "WAB" },
    { key: "CONF", label: "CONF" },
  ];

  useEffect(() => {
    fetch("/team_rankings.csv")
      .then((response) => response.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
          },
        });
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Team Stats</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Team</th>
            {headers.map((header) => (
              <th className={styles.th} key={header.key}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((team, idx) => (
            <tr key={idx}>
              <td className={styles.td}>{team["Team"]}</td>
              {headers.map((header) => (
                <td className={styles.td}key={header.key}>{team[header.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CsvTable;
