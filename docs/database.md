# Database

There are three schema types defined in `backend/stitched/database.js`.

<details>
  <summary><h3>Content</h3></summary>

- [Defaults Schema](#defaults-schema)
  - [momentOptions](#momentoptions)
  - [mementoOptions](#mementooptions)
  - [memoryTitles](#memorytitles)
  - [notifOptions](#notifoptions)
- [Entry Schema](#entry-schema)
- [Memento Schema](#memento-schema)

</details>
<hr>

# Defaults Schema

Configuration for all possible Moments, Memories and Mementos.

```js
{
  momentOptions: [],
  mementoOptions: [],
  memoryTitles: [],
  notifOptions: {}
}
```

## momentOptions

An array of possible moment types:

```js
{
  name: "<Moment name>",
  quota: "<boolean>",
  frequency: "<number>",
  span: "<day/week/month>" ,
  reminder: { time: "<hh:mm string>", action: "<Did you do moment name?>" },
  order: "<number>",
}
```

- **name**: The name displayed for the moment in the UI.
- **quota**: Determines how the moment's frequency is interpreted:
  - `true` - the moment should be completed `frequency` times per `span`.
  - `false` - the moment should be completed every `frequency` `span`s.
- **frequency**: The frequency of the moment.
- **span**: The span of the moment.
- **reminder** (optional): Consisting of a time string and an <ins>optional</ins> action. A reminder is sent only if the moment is due and has not been completed by the specified time.
- **order**: The order in which the moments show up in the UI.

## mementoOptions

An array of possible memento types:

```js
{
  name: "<Memento name>",
  category: "<Memento category>",
  intervalFromStart: "<boolean>",
  predict: "<boolean>",
  group: "<boolean>",
  order: "<number>",
},
```

- **name**: The name displayed for the memento in the UI.
- **category**: The category the memento belongs to.
- **intervalFromStart**: Set interval type:
  - `true` - interval is measured from the start date.
  - `false` - interval is measured from the end date.
- **predict**: If `true`, predictions of future occurrences for this memento type will be calculated.
- **group**: If `true`, mementos of this category are grouped together in the statistics.
- **order**: The order in which the mementos show up in the UI.

## memoryTitles

An array of possible memory titles:

```js
{
  name: "<Memory title>",
  default: "<boolean>",
  reminder: { time: "<hh:mm string>", action: "<Lets record this memory>" },
  order: "<number>",
},
```

- **name**: The title displayed for the memory in the UI.
- **default**: If `true`, this memory type is automatically added to new entries.
- **reminder** (optional): Consisting of a time string and an <ins>optional</ins> action. Will only send a reminder if the memory hasn't been filled by the specified time.
- **order**: The order in which the memories show up in the UI. First three appear beside the moments list, rest appear below.

## notifOptions

Optional notification configuration:

```js
{
  mementoReminder: "<hh:mm string>",
  simpleNotifs: ["<hh:mm strings>"] | [],
  useSimple: "<boolean>",
}
```

- **mementoReminder**: Time string. Will only send a reminder for ongoing mementos that have lasted longer than their average duration.
- **simpleNotifs**: Array of time strings for simple daily reminders, used to send notifications at set times.
- **useSimple**: If `true`, simple daily notifications are used instead of moment/memory/memento-specific reminders.

---

<img align="right" style="width:270px; height:auto;" src="https://github.com/user-attachments/assets/3c44d8ba-b8bb-4e7f-b36d-34d3fb72aec2" />

For example, a `Defaults` document could look like this:

```js
{
  "momentOptions": [
    //...
    {
      "name": "Lunch",
      "quota": false, // -> every [1] [day]
      "frequency": 1,
      "span": "day",
      "reminder": { "time": "13:00", "action": "Take a lunch break" },
      "order": 2
    },
    //...
    {
      "name": "Laundry",
      "quota": true,  // -> [2] times per [month]
      "frequency": 2,
      "span": "month",
      "order": 8
    }
  ],
  "mementoOptions": [
    //...
    {
      "name": "Social event",
      "category": "Social",
      "intervalFromStart": false,
      "predict": false,
      "group": true, //group with other Social mementos
      "order": 3
    },
    {
      "name": "Visit",
      "category": "Social",
      "intervalFromStart": false,
      "predict": false,
      "group": true, //group with other Social mementos
      "order": 4
    },
    {
      "name": "Headache",
      "category": "Health",
      "intervalFromStart": true,
      "predict": true, //calculate future occurrences
      "group": false,
      "order": 5
    }
    //...
  ],
  "memoryTitles": [
    {
      "name": "Daily summary",
      "default": true,  //automatically added to new entries
      "reminder": { "time": "20:00", "action": "Write down what you did today" },
      "order": 1
    },
    //...
    {
      "name": "Ideas & inspiration",
      "default": true,  //automatically added to new entries
      "order": 3
    },
    {
      "name": "Trip notes",
      "default": false, //not added to new entries automatically
      "order": 4
    }
  ],
  "notifOptions": {
    "mementoReminder": "18:30",
    "simpleNotifs": ["08:30", "13:00", "21:00"],
    "useSimple": true
  }
}
```

# Entry Schema

<div inline="float" align="right"><sub>Journal - Entry</sub>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
<img align="right" style="width:300px; height:auto;" src="https://github.com/user-attachments/assets/a13e730b-37a3-4191-bc71-8bf5a6a669f0" />

Daily entries, contains the `moments` and `memories` for a specific day. Gets created as you use the app.

For example, an `Entry` document could look like this:

```json
{
  "date": "2025-11-05",
  "moments": ["Breakfast", "Lunch"],
  "memories": [
    {
      "title": "Daily summary",
      "content": "- Made mock data\n- Node.js tutoring\n- Washed hair\n- Worked on readme"
    },
    {
      "title": "Daily reflections",
      "content": "\"What stands in the way becomes the way.\"\nMarcus Aurelius\n---\nObstacles are an opportunity for growth."
    },
    {
      "title": "Ideas & inspiration",
      "content": "[x] Add screenshots.\n[ ] Add examples."
    }
  ]
}
```

# Memento Schema

<div inline="float" align="right"><sub>Ongoing Mementos (for selected date)</sub>
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  <sub>Memento</sub>
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
</div>
<img align="right" style="width:250px; height:auto;" src="https://github.com/user-attachments/assets/5624fc2f-2b11-40f8-b216-b9f71aa2c50f" />
<img align="right" style="width:250px; height:auto;" src="https://github.com/user-attachments/assets/21e14981-5e7f-474b-b898-71d72a0591a0" />

Each `Memento` occurrence stores the start and end dates of a single instance.

For example a `Memento` document could look like this:

```json
{
  "name": "Sick",
  "start": "2025-11-01",
  "end": "2025-11-03",
  "duration": 3
}
```

---

[<- Back to Main Page](../)
