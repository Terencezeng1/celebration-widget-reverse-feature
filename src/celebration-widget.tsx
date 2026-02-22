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
  splitbyyear: any;
  splitbyyearreverse: any; // Feature: Descending tenure toggle
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

const User = ({ celebrationDateId, daymonthorder, showdate, user }: any) => {
  const userLink =
    we.authMgr.getBranchConfig().whitelabelConfig.frontendURL +
    "/profile/" +
    user.id;
  const hasAvatar = typeof user.avatar !== "undefined";

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

  const convertDate = (date: string, dateformat = "DD.MM") => {
    const dateArray = date.split(/[./ -]+/).filter((item) => item.length <= 2);
    const dateVal = new Date(
      0,
      parseInt(dateformat === "DD.MM" ? dateArray[1] : dateArray[0]) - 1,
      parseInt(dateformat === "DD.MM" ? dateArray[0] : dateArray[1]),
    );
    return dateVal.toLocaleString(
      dateformat === "DD.MM" ? "default" : "en-US",
      { month: "long", day: "numeric" },
    );
  };

  return (
    <div
      key={user.id + "divInner"}
      id={user.id}
      className="cw-entries"
      style={{
        borderRadius: "10px",
        border: "1px solid #D3D3D3",
        padding: "8px",
        margin: "10px 0px",
      }}
    >
      <a
        key={user.id + "a"}
        href={userLink}
        className="link-internal ally-focus-within"
      >
        {hasAvatar ? (
          <img
            key={user.id + "img"}
            data-type="thumb"
            data-size="35"
            aria-hidden="true"
            style={imgstyles.container}
            src={user.avatar.thumb ? user.avatar.thumb.url : ""}
            alt={user.firstName + " " + user.lastName}
          ></img>
        ) : (
          <span
            key={user.id + "span"}
            data-type="thumb"
            data-size="35"
            aria-hidden="true"
            style={spanstyles.container}
          >
            {user.firstName.substr(0, 1) + user.lastName.substr(0, 1)}
          </span>
        )}
        <div style={pstyles.container}>
          <div style={namestyles.container}>
            {user.firstName} {user.lastName}
          </div>
          <hr style={hrstyles.container}></hr>
          <span style={datestyles.container}>
            {showdate === "true"
              ? user.profile
                ? convertDate(user.profile[celebrationDateId], daymonthorder)
                : ""
              : ""}
          </span>
        </div>
      </a>
    </div>
  );
};

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
  const compareDates = (
    dateOne: string,
    dateTwo: string,
    dateformat = "DD.MM",
  ) => {
    const dateAarray = dateOne
      .split(/[./ -]+/)
      .filter((item) => item.length <= 2);
    const dateBarray = dateTwo
      .split(/[./ -]+/)
      .filter((item) => item.length <= 2);
    const dateA = new Date(
      0,
      parseInt(dateformat === "DD.MM" ? dateAarray[1] : dateAarray[0]) - 1,
      parseInt(dateformat === "DD.MM" ? dateAarray[0] : dateAarray[1]),
    );
    const dateB = new Date(
      0,
      parseInt(dateformat === "DD.MM" ? dateBarray[1] : dateBarray[0]) - 1,
      parseInt(dateformat === "DD.MM" ? dateBarray[0] : dateBarray[1]),
    );
    return {
      sameDate: dateA.getTime() === dateB.getTime(),
      sameMonth: dateA.getMonth() === dateB.getMonth(),
      daysDiff: Math.ceil(
        (dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24),
      ),
    };
  };

  const convertDate = (date: string, dateformat = "DD.MM") => {
    const dateArray = date.split(/[./ -]+/).filter((item) => item.length <= 2);
    const dateVal = new Date(
      0,
      parseInt(dateformat === "DD.MM" ? dateArray[1] : dateArray[0]) - 1,
      parseInt(dateformat === "DD.MM" ? dateArray[0] : dateArray[1]),
    );
    return dateVal.toLocaleString(
      dateformat === "DD.MM" ? "default" : "en-US",
      { month: "long", day: "numeric" },
    );
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

  const [usersList, setUsers] = React.useState([{}]);
  const [usersAreLoaded, setLoaded] = React.useState(Boolean);

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
  }, [anniversaryprofilefieldid]);

  const filteredUsers = usersList.filter((user) => {
    if (
      !user.profile ||
      typeof user.profile[anniversaryprofilefieldid] === "undefined" ||
      user.profile[anniversaryprofilefieldid] === null ||
      user.profile[anniversaryprofilefieldid] === ""
    )
      return false;

    // Filter logic
    if (fieldfilter !== "" && fieldfilter !== undefined) {
      const fieldvalarr = fieldvalue.split(",").map((val) => val.toLowerCase());
      if (
        user.profile &&
        ((user.profile[fieldfilter] &&
          !fieldvalarr.includes(user.profile[fieldfilter].toLowerCase())) ||
          typeof user.profile[fieldfilter] === "undefined")
      )
        return false;
    }

    const dateComparison = compareDates(
      user.profile[anniversaryprofilefieldid],
      dateNow,
      dateformat,
    );
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
      usersByGroupCondition = filteredUsers.reduce((arr: {}, user) => {
        // Robust Year Parsing: Find the 4-digit segment
        const dateParts =
          user.profile[anniversaryprofilefieldid].split(/[./ -]+/);
        const yearPart = dateParts.find((part) => part.length === 4);
        const hireYear = yearPart
          ? parseInt(yearPart)
          : parseInt(dateNow.substr(6, 4));

        let yearCount = parseInt(dateNow.substr(6, 4)) - hireYear;
        yearCount =
          yearCount > 120
            ? yearCount - (parseInt(dateNow.substr(6, 2)) - 1) * 100
            : yearCount;
        arr[yearCount] = arr[yearCount] || [];
        arr[yearCount].push(user);
        return arr;
      }, {});
    } else {
      usersByGroupCondition = filteredUsers.reduce((arr, user) => {
        const dateComparison = compareDates(
            user.profile[anniversaryprofilefieldid],
            dateNow,
            dateformat,
          ),
          dateGroup = dateComparison.sameDate
            ? "1-today"
            : dateComparison.daysDiff < 0
              ? "0-previous"
              : "2-upcoming";
        arr[dateGroup] = arr[dateGroup] || [];
        arr[dateGroup].push(user);
        return arr;
      }, {});
    }

    // Logic: Sorting the year groups (Ascending vs Descending)
    let groupKeys = Object.keys(usersByGroupCondition);
    if (splitbyyearreverse === "true") {
      groupKeys = groupKeys.sort((a, b) => parseInt(b) - parseInt(a)); // Descending: 15, 10, 5...
    } else {
      groupKeys = groupKeys.sort((a, b) => parseInt(a) - parseInt(b)); // Ascending: 1, 5, 10...
    }

    for (const groupCondition of groupKeys) {
      const usersGroup = usersByGroupCondition[groupCondition];
      if (limit !== undefined && anniversariesCount >= limit) break;

      if (
        (includeyear === "true" ||
          daysaftertitle !== undefined ||
          daysbeforetitle !== undefined) &&
        hideyearheader === "false"
      ) {
        htmlList.push(
          <h2
            key={groupCondition}
            style={{
              margin: "0",
              color: "#" + (headercolor ? headercolor : "000000"),
            }}
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

      usersGroup.map((theUser) => {
        anniversariesCount++;
        if (limit !== undefined && anniversariesCount > limit) return;
        htmlList.push(
          <User
            key={theUser.id}
            celebrationDateId={anniversaryprofilefieldid}
            daymonthorder={dateformat}
            showdate={showdate}
            user={theUser}
          />,
        );
      });
    }
  } else if (!usersAreLoaded) {
    htmlList.push(<p key="cw-loading">{loadingmessage}</p>);
  } else {
    htmlList.push(<p key="cw-noinstances">{noinstancesmessage}</p>);
  }

  const containerStyles: React.CSSProperties = {
    height: numbertoshow ? numbertoshow + "px" : "auto",
    overflow: "auto",
    padding: "3px",
  };

  return (
    <div id={"cw-" + anniversaryprofilefieldid} style={containerStyles}>
      <h1 style={{ color: "#" + (headercolor ? headercolor : "000000") }}>
        {title}
      </h1>
      <div id="cw-list-container">{htmlList}</div>
    </div>
  );
};
