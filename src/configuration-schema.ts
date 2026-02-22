/*!
 * Copyright 2021, Staffbase GmbH and contributors.
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

import { UiSchema } from "@rjsf/core";
import { JSONSchema7 } from "json-schema";

/**
 * schema used for generation of the configuration dialog
 * see https://react-jsonschema-form.readthedocs.io/en/latest/ for documentation
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    title: {
      type: "string",
      title: "Title",
    },
    fieldfilter: {
      type: "string",
      title: "Filter Profile Field ID",
    },
    fieldvalue: {
      type: "string",
      title: "Filter Profile Field Value",
    },
    numbertoshow: {
      type: "number",
      title: "Height (px)",
    },
    anniversaryprofilefieldid: {
      type: "string",
      title: "Celebration Profile Field ID",
    },
    dateformat: {
      type: "string",
      enum: ["DD.MM", "MM.DD"],
      title: "Day/Month Order",
      default: "MM.DD",
    },
    showdate: {
      type: "boolean",
      title: "Show Celebration Date?",
      default: true,
    },
    hideemptywidget: {
      type: "boolean",
      title: "Hide widget if empty",
      default: false,
    },
    loadingmessage: {
      type: "string",
      title: "Message when the widget is still loading",
    },
    noinstancesmessage: {
      type: "string",
      title: "Message when there are no applicable users",
    },
    yearword: {
      type: "string",
      title: "Year Word",
    },
    yearwordplural: {
      type: "string",
      title: "Year Word Plural",
    },
    includeyear: {
      type: "boolean",
      title: "Split by Year",
    },
    splitbyyearreverse: {
      type: "boolean",
      title: "Split by Year Reverse",
      default: false,
    },
    showdaysbefore: {
      type: "number",
      title: "Number of Days Before Celebrations",
      default: 0,
    },
    showdaysafter: {
      type: "number",
      title: "Number of Days After Celebrations",
      default: 30,
    },
    specialyears: {
      type: "string",
      title: "Special Years",
    },
    headercolor: {
      type: "string",
      title: "Header Color",
    },
    hideyearheader: {
      type: "boolean",
      title: "Hide year header",
      default: false,
    },
    optoutfield: {
      type: "string",
      title: "Profile Field ID for Opt Out Field",
    },
    optoutvalue: {
      type: "string",
      title: "Value for Opt Out Field",
    },
    includepending: {
      type: "boolean",
      title: "Include Pending Users",
      default: false,
    },
  },
  required: ["anniversaryprofilefieldid", "dateformat"],
  dependencies: {
    includepending: {
      oneOf: [
        {
          properties: {
            includepending: {
              enum: [true],
            },
            networkid: {
              type: "string",
              title: "Network Plugin ID",
            },
          },
          required: ["networkid"],
        },
      ],
    },
  },
};

/**
 * schema to add more customization to the form's look and feel
 * @see https://react-jsonschema-form.readthedocs.io/en/latest/api-reference/uiSchema/
 */
export const uiSchema: UiSchema = {
  anniversaryprofilefieldid: {
    "ui:help":
      "Enter the profile field ID of the field that holds the date information",
  },
  dateformat: {
    "ui:help": "Enter the order of day and month here",
  },
  includepending: {
    "ui:help": "Check to include pending users",
    "ui:hidden": true,
  },
  title: {
    "ui:help": "The title of the widget",
  },
  loadingmessage: {
    "ui:help":
      "The message that will be shown while the widget is still loading",
  },
  noinstancesmessage: {
    "ui:help":
      "Text that will be shown in the event that there are no applicable users",
  },
  yearword: {
    "ui:help":
      "The word to use for the instance (Anniversary, Birthday, Year, etc)",
  },
  yearwordplural: {
    "ui:help":
      "The word to use for the instance plural (Anniversaries, Birthdays, Years, etc)",
  },
  showdate: {
    "ui:help": "Select to show the user's date next to the user's name",
  },
  hideemptywidget: {
    "ui:help":
      "If enabled and no applicable user is found, the widget will be hidden.",
  },
  showdaysbefore: {
    "ui:help":
      "The number of previous days for which corresponding instances should be shown",
  },
  showdaysafter: {
    "ui:help":
      "The number of upcoming days for which corresponding instances should be shown",
  },
  specialyears: {
    "ui:help":
      "If only certain years of celebrations should be shown, enter numbers separated by commas",
  },
  hideyearheader: {
    "ui:help":
      "Especially useful if you are showing only one special year and the title is redundant",
  },
  fieldfilter: {
    "ui:help": "The profile field ID that will be used to filter users",
  },
  fieldvalue: {
    "ui:help": "The profile field value that will be used to filter users",
  },
  headercolor: {
    "ui:help": "Hexcode color of the Header",
  },
  includeyear: {
    "ui:help": "Split by year and show year of celebration",
  },

  splitbyyearreverse: {
    "ui:help": "Show longest tenure (highest years) first",
  },
  numbertoshow: {
    "ui: help":
      "Enter the height of the widget (in pixels) Each profile is approximately 80 px. If left blank, all profiles will be shown.",
  },
  optoutfield: {
    "ui:help": "Profile Field ID for Opt Out Field",
  },
};
