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
  headercolor: string;
  includeyear: boolean;
  splitbyyearreverse: boolean; // Confirmed Boolean Property
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
    showdaysbefore,
    showdaysafter,
    specialyears,
    hideyearheader,
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

  // USE YOUR WORKING DATE LOGIC (From Improvements build)
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
    // LISTEN TO PROPS: This ensures the toggle re-triggers the user load if needed
  }, [networkid, anniversaryprofilefieldid]);

  const dateNow = new Date().toLocaleDateString(
    dateformat === "DD.MM" ? "de-DE" : "en-US",
    { year: "numeric", month: "2-digit", day: "2-digit" },
  );

  // RESTORED: Your working filtering logic
  const filteredUsers = usersList.filter((user) => {
    if (!user.profile || !user.profile[anniversaryprofilefieldid]) return false;
    const profileDate = user.profile[anniversaryprofilefieldid];
    const dateComparison = compareDates(profileDate, dateNow, dateformat);
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

  let usersByGroupCondition = {};
  if (includeyear === true || includeyear === "true") {
    usersByGroupCondition = filteredUsers.reduce((arr: any, user: any) => {
      const parts = user.profile[anniversaryprofilefieldid].split(/[./ -]+/);
      const hireYearString = parts.find((p) => p.length === 4);
      if (hireYearString) {
        const yearCount = new Date().getFullYear() - parseInt(hireYearString);
        arr[yearCount] = arr[yearCount] || [];
        arr[yearCount].push(user);
      }
      return arr;
    }, {});
  } else {
    usersByGroupCondition = filteredUsers.reduce((arr: any, user: any) => {
      const comp = compareDates(
        user.profile[anniversaryprofilefieldid],
        dateNow,
        dateformat,
      );
      const group = comp.sameDate
        ? "1-today"
        : comp.daysDiff < 0
          ? "0-previous"
          : "2-upcoming";
      arr[group] = arr[group] || [];
      arr[group].push(user);
      return arr;
    }, {});
  }

  // REVERSE FEATURE: Listen to boolean true OR string 'true'
  let groupKeys = Object.keys(usersByGroupCondition);
  const isReverse =
    splitbyyearreverse === true || splitbyyearreverse === "true";

  if (isReverse) {
    groupKeys.sort((a, b) => parseInt(b) - parseInt(a)); // Descending
  } else {
    groupKeys.sort((a, b) =>
      isNaN(parseInt(a)) ? a.localeCompare(b) : parseInt(a) - parseInt(b),
    ); // Ascending
  }

  const htmlList = groupKeys.map((key) => {
    const users = usersByGroupCondition[key];
    const titleText =
      key === "1-today"
        ? todaytitle
        : key === "2-upcoming"
          ? daysaftertitle
          : key === "0-previous"
            ? daysbeforetitle
            : `${key} ${parseInt(key) > 1 ? yearwordplural : yearword}`;

    return (
      <div key={key}>
        {hideyearheader !== true && hideyearheader !== "true" && (
          <h2 style={{ color: `#${headercolor || "000"}` }}>{titleText}</h2>
        )}
        {users.map((u: any) => (
          <div
            key={u.id}
            style={{
              border: "1px solid #ddd",
              margin: "5px 0",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#eee",
                  borderRadius: "50%",
                  marginRight: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {u.avatar?.thumb ? (
                  <img
                    src={u.avatar.thumb.url}
                    style={{ width: "100%", borderRadius: "50%" }}
                  />
                ) : (
                  u.firstName[0]
                )}
              </div>
              <div>
                <strong>
                  {u.firstName} {u.lastName}
                </strong>
                <br />
                {showdate && (
                  <small>
                    {convertDate(
                      u.profile[anniversaryprofilefieldid],
                      dateformat,
                    )}
                  </small>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  });

  return (
    <div
      style={{
        height: numbertoshow ? `${numbertoshow}px` : "auto",
        overflow: "auto",
        padding: "10px",
      }}
    >
      <h1 style={{ color: `#${headercolor || "000"}` }}>{title}</h1>
      {usersAreLoaded ? htmlList : <p>{loadingmessage}</p>}
      {usersAreLoaded && filteredUsers.length === 0 && (
        <p>{noinstancesmessage}</p>
      )}
    </div>
  );
};
