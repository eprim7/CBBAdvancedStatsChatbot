import React, { useEffect, useState } from "react";
import styles from "../CsvTable/CsvTable.module.css";

const CsvTable = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [conferenceFilter, setConferenceFilter] = useState("All");
  const [conferences, setConferences] = useState([]);

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
  fetch("http://localhost:5000/api/stats")
    .then((response) => response.json())
    .then((data) => {
      setData(data);

      const uniqueConfs = [
        ...new Set(data.map((row) => row.CONF).filter(Boolean)),
      ].sort();
      setConferences(uniqueConfs);
    })
    .catch((error) => console.error("Error fetching data:", error));
}, []);


  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = React.useMemo(() => {
    if (conferenceFilter === "All") return data;
    return data.filter((row) => row.CONF === conferenceFilter);
  }, [data, conferenceFilter]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = isNaN(parseFloat(a[sortConfig.key]))
        ? a[sortConfig.key]
        : parseFloat(a[sortConfig.key]);
      const bValue = isNaN(parseFloat(b[sortConfig.key]))
        ? b[sortConfig.key]
        : parseFloat(b[sortConfig.key]);

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Team Stats</h1>

      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "8px" }}>Filter by Conference:</label>
        <select
          value={conferenceFilter}
          onChange={(e) => setConferenceFilter(e.target.value)}
        >
          <option value="All">All</option>
          {conferences.map((conf) => (
            <option key={conf} value={conf}>
              {conf}
            </option>
          ))}
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th
              className={styles.th}
              onClick={() => handleSort("Team")}
              style={{ cursor: "pointer" }}
            >
              Team{" "}
              {sortConfig.key === "Team" &&
                (sortConfig.direction === "asc" ? "▲" : "▼")}
            </th>
            {headers.map((header) => (
              <th
                className={styles.th}
                key={header.key}
                onClick={() => handleSort(header.key)}
                style={{ cursor: "pointer" }}
              >
                {header.label}{" "}
                {sortConfig.key === header.key &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((team, idx) => (
            <tr key={idx}>
              <td className={styles.td}>{team["Team"]}</td>
              {headers.map((header) => (
                <td className={styles.td} key={header.key}>
                  {team[header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CsvTable;
