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

/**
 * React Component
 */
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
  showwholemonthforxdays: number;
  showdaysbefore: number;
  showdaysafter: number;
  specialyears: string;
  hideyearheader: boolean;
  linktochat: boolean;
  limit: number;
  imageurl: string;
  headercolor: string;
  additionalfieldsdisplayed: string;
  optoutgroupid: string;
  includeyear: boolean;
  splitbyyearreverse: boolean; // ADDED: Matches schema property name
  daysbeforetitle: string;
  daysaftertitle: string;
  groupid: string;
  networkid: string;
  numbertoshow: number;
  fieldfilter: string;
  fieldvalue: string;
  optoutfield: string;
  optoutvalue: string;
}

export const CelebrationWidget = ({
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
  groupid,
  showwholemonthforxdays,
  imageurl,
  showdaysbefore,
  showdaysafter,
  splitbyyear,
  splitbyyearreverse,
  specialyears,
  hideyearheader,
  linktochat,
  limit,
  headercolor,
  additionalfieldsdisplayed,
  optoutgroupid,
  includeyear,
  daysbeforetitle,
  daysaftertitle,
  networkid,
  fieldfilter,
  fieldvalue,
  optoutfield,
  optoutvalue,
}: CelebrationWidgetProps): ReactElement => {
  // FIX: Robust Date Comparison Logic using fixed regex [./ -]
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

  // FIX: Robust date conversion for local preview
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
      dateformat == "DD.MM" ? "de-DE" : "en-US",
      { year: "numeric", month: "2-digit", day: "2-digit" },
    ),
    daysSinceBeginningOfMonth = compareDates(
      dateNow,
      dateformat == "DD.MM"
        ? "01" + dateNow.substring(2)
        : dateNow.substring(0, 3) + "01",
      dateformat,
    ).daysDiff;

  const h2styles: { [key: string]: React.CSSProperties } = {
    container: { color: "#" + (headercolor ? headercolor : "000000") },
  };
  const divstyles: { [key: string]: React.CSSProperties } = {
    container: {
      borderRadius: "10px",
      border: "1px solid #D3D3D3",
      padding: "8px",
      margin: "10px 0px",
    },
  };
  const pstyles: { [key: string]: React.CSSProperties } = {
    container: { display: "inline-block", marginTop: "0", color: "#000000" },
  };
  const hrstyles: { [key: string]: React.CSSProperties } = {
    container: { margin: "0" },
  };
  const namestyles: { [key: string]: React.CSSProperties } = {
    container: { fontSize: "16px" },
  };
  const datestyles: { [key: string]: React.CSSProperties } = {
    container: { fontSize: "12px" },
  };
  const imgstyles: { [key: string]: React.CSSProperties } = {
    container: {
      width: "55px",
      height: "55px",
      verticalAlign: "top",
      borderRadius: "5px",
      marginInlineEnd: "15px",
    },
  };
  const spanstyles: { [key: string]: React.CSSProperties } = {
    container: {
      width: "55px",
      height: "55px",
      backgroundColor: we.authMgr.getBranch().colors.backgroundColor,
      fontSize: "26px",
      lineHeight: "55px",
      color: we.authMgr.getBranch().colors.textColor,
      textAlign: "center",
      verticalAlign: "top",
      borderRadius: "5px",
      marginRight: "15px",
      display: "inline-block",
    },
  };

  const [usersList, setUsers] = React.useState([{}]);
  const [usersAreLoaded, setLoaded] = React.useState(Boolean);
  const [networkID, setNID] = React.useState(String);

  React.useEffect(() => {
    setLoaded(false);
    const getAllUsers = async (
      limit: number,
      offset: number,
      users: Array<Object>,
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
  }, [networkID]);

  const filteredUsers = usersList.filter((user) => {
    if (
      !user.profile ||
      typeof user.profile[anniversaryprofilefieldid] === "undefined"
    )
      return false;
    const profileDate = user.profile[anniversaryprofilefieldid];
    if (profileDate == "" || profileDate == null) return false;

    const profileParts = profileDate.split(/[./ -]+/);
    const profileYear = profileParts.find((p) => p.length === 4);
    const currentYearStr = dateNow.split(/[./ -]+/).find((p) => p.length === 4);
    if (profileYear && currentYearStr && profileYear === currentYearStr)
      return false;

    const dateComparison = compareDates(profileDate, dateNow, dateformat);
    if (showwholemonth === "true")
      return dateComparison.sameMonth && daysSinceBeginningOfMonth >= 0;

    return (
      dateComparison.sameDate ||
      (dateComparison.daysDiff >= -showdaysbefore &&
        dateComparison.daysDiff < 0) ||
      (dateComparison.daysDiff <= showdaysafter && dateComparison.daysDiff > 0)
    );
  });

  filteredUsers.sort((userA, userB) => {
    return compareDates(
      userA.profile[anniversaryprofilefieldid],
      userB.profile[anniversaryprofilefieldid],
      dateformat,
    ).daysDiff;
  });

  let htmlList = [];
  if (filteredUsers.length > 0) {
    if (includeyear === "true") {
      usersByGroupCondition = filteredUsers.reduce((arr: {}, user: any) => {
        const profileDate = user.profile[anniversaryprofilefieldid];
        const dateParts = profileDate.split(/[./ -]+/);
        const hireYearString = dateParts.find((p) => p.length === 4);
        const hireYear = hireYearString ? parseInt(hireYearString) : null;
        if (hireYear) {
          const currentYear = new Date().getFullYear();
          let yearCount = currentYear - hireYear;
          const currentMonthPart = parseInt(
            dateNow.split(/[./ -]+/).filter((p) => p.length <= 2)[1],
          );
          yearCount =
            yearCount > 120
              ? yearCount - (currentMonthPart - 1) * 100
              : yearCount;
          arr[yearCount] = arr[yearCount] || [];
          arr[yearCount].push(user);
        }
        return arr;
      }, {});
    } else {
      usersByGroupCondition = filteredUsers.reduce((arr, user) => {
        const comp = compareDates(
            user.profile[anniversaryprofilefieldid],
            dateNow,
            dateformat,
          ),
          dateGroup = comp.sameDate
            ? "1-today"
            : comp.daysDiff < 0
              ? "0-previous"
              : "2-upcoming";
        arr[dateGroup] = arr[dateGroup] || [];
        arr[dateGroup].push(user);
        return arr;
      }, {});
    }

    // --- NEW: THE REVERSE SORT GATE ---
    // We extract keys and sort them ONLY if the toggle is boolean true or string 'true'
    let groupKeys = Object.keys(usersByGroupCondition);
    if (
      (includeyear === "true" || includeyear === true) &&
      (splitbyyearreverse === true || splitbyyearreverse === "true")
    ) {
      groupKeys.sort((a, b) => parseInt(b) - parseInt(a)); // Longest tenure first
    } else if (includeyear === "true" || includeyear === true) {
      groupKeys.sort((a, b) => parseInt(a) - parseInt(b)); // Shortest tenure first
    } else {
      groupKeys.sort(); // 0-previous, 1-today, 2-upcoming
    }

    for (const groupCondition of groupKeys) {
      const usersGroup = usersByGroupCondition[groupCondition];
      if (limit !== undefined) if (anniversariesCount >= limit) break;
      if (
        (includeyear === "true" ||
          daysaftertitle !== undefined ||
          daysbeforetitle !== undefined) &&
        hideyearheader === "false"
      ) {
        htmlList.push(
          <h2
            key={groupCondition}
            style={hrstyles.container}
            className="cw-group-condition-title"
          >
            {groupCondition === "1-today"
              ? todaytitle
              : groupCondition === "2-upcoming"
                ? daysaftertitle
                : groupCondition === "0-previous"
                  ? daysbeforetitle
                  : groupCondition +
                    " " +
                    (parseInt(groupCondition) > 1 ? yearwordplural : yearword)}
          </h2>,
        );
      }
      htmlList.push(
        usersGroup.map((theUser) => {
          const hasAvatar =
              typeof theUser.avatar !== "undefined" || imageurl !== undefined,
            userLink =
              we.authMgr.getBranchConfig().whitelabelConfig.frontendURL +
              "/profile/" +
              theUser.id;
          return (
            <div
              key={theUser.id + "divInner"}
              id={theUser.id}
              className="cw-entries"
              style={divstyles.container}
            >
              <a
                key={theUser.id + "a"}
                href={userLink}
                className="link-internal ally-focus-within"
              >
                {hasAvatar ? (
                  <img
                    key={theUser.id + "img"}
                    data-type="thumb"
                    data-size="35"
                    style={imgstyles.container}
                    src={
                      theUser.avatar
                        ? theUser.avatar.thumb
                          ? theUser.avatar.thumb.url
                          : imageurl
                        : imageurl
                    }
                    alt={theUser.firstName + " " + theUser.lastName}
                  ></img>
                ) : (
                  <span
                    key={theUser.id + "span"}
                    data-type="thumb"
                    data-size="35"
                    style={spanstyles.container}
                  >
                    {theUser.firstName.substr(0, 1) +
                      theUser.lastName.substr(0, 1)}
                  </span>
                )}
                <div style={pstyles.container}>
                  <div style={namestyles.container}>
                    {theUser.firstName} {theUser.lastName}
                  </div>
                  <hr style={hrstyles.container}></hr>
                  <span style={datestyles.container}>
                    {showdate === "true"
                      ? theUser.profile
                        ? convertDate(
                            theUser.profile[anniversaryprofilefieldid],
                            dateformat,
                          )
                        : ""
                      : ""}
                  </span>
                </div>
              </a>
            </div>
          );
        }),
      );
      anniversariesCount = anniversariesCount + usersGroup.length;
    }
  } else if (!usersAreLoaded) {
    htmlList.push(<p key="cw-loading">{loadingmessage}</p>);
  } else {
    htmlList.push(<p key="cw-noinstances">{noinstancesmessage}</p>);
  }

  return (
    <div
      id={"cw-" + anniversaryprofilefieldid}
      style={{
        height: numbertoshow ? numbertoshow + "px" : "auto",
        overflow: "auto",
        padding: "3px",
      }}
    >
      <h1 id="cw-title" style={h2styles.container}>
        {title}
      </h1>
      <div id="cw-list-container" key="userList">
        {htmlList}
      </div>
    </div>
  );
};
