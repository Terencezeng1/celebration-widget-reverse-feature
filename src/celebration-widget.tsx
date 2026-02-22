/*!
 * Copyright 2020, Staffbase GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactElement } from "react";
import { BlockAttributes } from "widget-sdk";

export interface CelebrationWidgetProps extends BlockAttributes {
  anniversaryprofilefieldid: string;
  dateformat: string;
  includepending: boolean;
  loadingmessage: string;
  noinstancesmessage: string;
  title: string;
  todaytitle: string;
  yearword: string;
  yearwordplural: string;
  showdate: boolean;
  hideemptywidget: boolean;
  showwholemonth: boolean;
  showdaysbefore: number;
  showdaysafter: number;
  specialyears: string;
  hideyearheader: boolean;
  limit: number;
  imageurl: string;
  headercolor: string;
  includeyear: boolean;
  splitbyyearreverse: boolean; // Added for Reverse Tenure Feature
  daysbeforetitle: string;
  daysaftertitle: string;
  networkid: string;
  numbertoshow: number;
  fieldfilter: string;
  fieldvalue: string;
  optoutfield: string;
  optoutvalue: string;
}

export const CelebrationWidget = (
  props: CelebrationWidgetProps,
): ReactElement => {
  // Destructure props for cleaner usage
  const {
    dateformat,
    anniversaryprofilefieldid,
    includepending,
    numbertoshow,
    loadingmessage,
    noinstancesmessage,
    title,
    todaytitle,
    yearword,
    yearwordplural,
    showdate,
    hideemptywidget,
    showwholemonth,
    imageurl,
    showdaysbefore,
    showdaysafter,
    specialyears,
    hideyearheader,
    limit,
    headercolor,
    includeyear,
    splitbyyearreverse,
    daysbeforetitle,
    daysaftertitle,
    networkid,
    fieldfilter,
    fieldvalue,
    optoutfield,
    optoutvalue,
  } = props;

  // Robust Date Comparison from your "Improvements" build
  const compareDates = (dateOne: string, dateTwo: string, format = "DD.MM") => {
    const arrA = dateOne.split(/[./ -]+/);
    const arrB = dateTwo.split(/[./ -]+/);
    const yearIndexA = arrA.findIndex((p) => p.length === 4);
    const yearIndexB = arrB.findIndex((p) => p.length === 4);
    const cleanA = arrA.filter((_, i) => i !== yearIndexA);
    const cleanB = arrB.filter((_, i) => i !== yearIndexB);

    const dateA = new Date(
      0,
      parseInt(format === "DD.MM" ? cleanA[1] : cleanA[0]) - 1,
      parseInt(format === "DD.MM" ? cleanA[0] : cleanA[1]),
    );
    const dateB = new Date(
      0,
      parseInt(format === "DD.MM" ? cleanB[1] : cleanB[0]) - 1,
      parseInt(format === "DD.MM" ? cleanB[0] : cleanB[1]),
    );

    return {
      sameDate: dateA.getTime() === dateB.getTime(),
      sameMonth: dateA.getMonth() === dateB.getMonth(),
      daysDiff: Math.ceil(
        (dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24),
      ),
    };
  };

  const convertDate = (date: string, format = "DD.MM") => {
    const dateArray = date.split(/[./ -]+/).filter((item) => item.length <= 2);
    const dateVal = new Date(
      0,
      parseInt(format === "DD.MM" ? dateArray[1] : dateArray[0]) - 1,
      parseInt(format === "DD.MM" ? dateArray[0] : dateArray[1]),
    );
    return dateVal.toLocaleString(format === "DD.MM" ? "default" : "en-US", {
      month: "long",
      day: "numeric",
    });
  };

  let usersByGroupCondition = {},
    anniversariesCount = 0;
  const dateNow = new Date().toLocaleDateString(
    dateformat === "DD.MM" ? "de-DE" : "en-US",
    { year: "numeric", month: "2-digit", day: "2-digit" },
  );
  const daysSinceBeginningOfMonth = compareDates(
    dateNow,
    dateformat === "DD.MM"
      ? "01" + dateNow.substring(2)
      : dateNow.substring(0, 3) + "01",
    dateformat,
  ).daysDiff;

  const [usersList, setUsers] = React.useState([]);
  const [usersAreLoaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setLoaded(false);
    const getAllUsers = async (
      limit: number,
      offset: number,
      users: Array<any>,
    ) => {
      const loadedUsers = await we.api.getUsers({
        status: "activated",
        limit: limit,
        offset: offset,
      });
      users = users.concat(loadedUsers.data);
      if (loadedUsers.total <= limit + offset) {
        setUsers(users);
        setLoaded(true);
      } else {
        await getAllUsers(limit, limit + offset, users);
      }
    };
    getAllUsers(1000, 0, []).catch(console.error);
  }, [anniversaryprofilefieldid]);

  const filteredUsers = usersList.filter((user) => {
    if (
      !user.profile ||
      typeof user.profile[anniversaryprofilefieldid] === "undefined"
    )
      return false;

    // Opt-out and Filtering logic
    if (fieldfilter && fieldvalue) {
      const fieldvalarr = fieldvalue.split(",").map((val) => val.toLowerCase());
      if (
        !user.profile[fieldfilter] ||
        !fieldvalarr.includes(user.profile[fieldfilter].toLowerCase())
      )
        return false;
    }
    if (optoutfield && optoutvalue) {
      const optoutValArr = optoutvalue
        .split(",")
        .map((val) => val.toLowerCase());
      if (
        user.profile[optoutfield] &&
        optoutValArr.includes(user.profile[optoutfield].toLowerCase())
      )
        return false;
    }

    const profileDate = user.profile[anniversaryprofilefieldid];
    if (!profileDate) return false;

    const dateComparison = compareDates(profileDate, dateNow, dateformat);
    if (showwholemonth === "true" || showwholemonth === true)
      return dateComparison.sameMonth && daysSinceBeginningOfMonth >= 0;

    return (
      dateComparison.sameDate ||
      (dateComparison.daysDiff >= -showdaysbefore &&
        dateComparison.daysDiff < 0) ||
      (dateComparison.daysDiff <= showdaysafter && dateComparison.daysDiff > 0)
    );
  });

  filteredUsers.sort(
    (a, b) =>
      compareDates(
        a.profile[anniversaryprofilefieldid],
        b.profile[anniversaryprofilefieldid],
        dateformat,
      ).daysDiff,
  );

  let htmlList = [];
  if (filteredUsers.length > 0) {
    if (includeyear === "true" || includeyear === true) {
      usersByGroupCondition = filteredUsers.reduce((arr: any, user: any) => {
        const profileDate = user.profile[anniversaryprofilefieldid];
        const dateParts = profileDate.split(/[./ -]+/);
        const hireYearString = dateParts.find((p) => p.length === 4);
        const hireYear = hireYearString ? parseInt(hireYearString) : null;

        if (hireYear) {
          const currentYear = new Date().getFullYear();
          let yearCount = currentYear - hireYear;
          arr[yearCount] = arr[yearCount] || [];
          arr[yearCount].push(user);
        }
        return arr;
      }, {});

      if (specialyears) {
        const specialyearsarr = specialyears.split(",");
        usersByGroupCondition = Object.keys(usersByGroupCondition)
          .filter((y) => specialyearsarr.includes(y))
          .reduce((obj, key) => {
            obj[key] = usersByGroupCondition[key];
            return obj;
          }, {});
      }
    } else {
      usersByGroupCondition = filteredUsers.reduce((arr: any, user: any) => {
        const dateComparison = compareDates(
          user.profile[anniversaryprofilefieldid],
          dateNow,
          dateformat,
        );
        const dateGroup = dateComparison.sameDate
          ? "1-today"
          : dateComparison.daysDiff < 0
            ? "0-previous"
            : "2-upcoming";
        arr[dateGroup] = arr[dateGroup] || [];
        arr[dateGroup].push(user);
        return arr;
      }, {});
    }

    // --- REVERSE SORT GATE ---
    let groupKeys = Object.keys(usersByGroupCondition);
    if (splitbyyearreverse === "true" || splitbyyearreverse === true) {
      groupKeys = groupKeys.sort((a, b) => parseInt(b) - parseInt(a));
    } else {
      groupKeys = groupKeys.sort((a, b) =>
        isNaN(parseInt(a)) ? a.localeCompare(b) : parseInt(a) - parseInt(b),
      );
    }

    for (const groupCondition of groupKeys) {
      const usersGroup = usersByGroupCondition[groupCondition];
      if (limit && anniversariesCount >= limit) break;

      if (
        (includeyear || daysaftertitle || daysbeforetitle) &&
        hideyearheader !== true
      ) {
        const groupTitle =
          groupCondition === "1-today"
            ? todaytitle
            : groupCondition === "2-upcoming"
              ? daysaftertitle
              : groupCondition === "0-previous"
                ? daysbeforetitle
                : groupCondition +
                  " " +
                  (parseInt(groupCondition) > 1 ? yearwordplural : yearword);
        htmlList.push(
          <h2
            key={groupCondition}
            style={{ margin: "0", color: "#" + (headercolor || "000000") }}
          >
            {groupTitle}
          </h2>,
        );
      }

      usersGroup.forEach((theUser: any) => {
        anniversariesCount++;
        const userLink =
          we.authMgr.getBranchConfig().whitelabelConfig.frontendURL +
          "/profile/" +
          theUser.id;
        htmlList.push(
          <div
            key={theUser.id}
            style={{
              borderRadius: "10px",
              border: "1px solid #D3D3D3",
              padding: "8px",
              margin: "10px 0px",
            }}
          >
            <a
              href={userLink}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "55px",
                  height: "55px",
                  backgroundColor: "#eee",
                  borderRadius: "5px",
                  marginRight: "15px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "20px",
                }}
              >
                {theUser.avatar?.thumb ? (
                  <img
                    src={theUser.avatar.thumb.url}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "5px",
                    }}
                  />
                ) : (
                  theUser.firstName[0] + theUser.lastName[0]
                )}
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {theUser.firstName} {theUser.lastName}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {showdate
                    ? convertDate(
                        theUser.profile[anniversaryprofilefieldid],
                        dateformat,
                      )
                    : ""}
                </div>
              </div>
            </a>
          </div>,
        );
      });
    }
  } else if (!usersAreLoaded) {
    htmlList.push(<p key="loading">{loadingmessage}</p>);
  } else {
    htmlList.push(<p key="no-users">{noinstancesmessage}</p>);
  }

  return (
    <div
      style={{
        padding: "3px",
        height: numbertoshow ? numbertoshow + "px" : "auto",
        overflow: "auto",
      }}
    >
      <h1 style={{ color: "#" + (headercolor || "000000") }}>{title}</h1>
      <div>{htmlList}</div>
    </div>
  );
};
