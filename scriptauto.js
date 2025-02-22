// Initialize dropdown options
document.addEventListener("DOMContentLoaded", function () {
  initializeNumberSelect("vehicle-count", 10, 1)
  initializeNumberSelect("driver-count", 10, 1)
  generateVehicleFields()
  generateDriverFields()
  populateInFileCheckboxes()
  populateNoteCheckboxes()
})

// No. of Driver and Vehicle, default value is 1
function initializeNumberSelect(id, max, defaultValue = 1) {
  const select = document.getElementById(id)
  select.innerHTML = ""
  for (let i = 1; i <= max; i++) {
    select.innerHTML += `<option value="${i}" ${
      i === defaultValue ? "selected" : ""
    }>${i}</option>`
  }
}

// Uploader Handling
function toggleOtherUploader() {
  const uploader = document.getElementById("uploader")
  const otherInput = document.getElementById("other-uploader")
  otherInput.style.display =
    uploader.value === "other" ? "inline-block" : "none"
}

// Producer Handling
function toggleOtherProducer() {
  const producer = document.getElementById("producer")
  const otherInput = document.getElementById("other-producer")
  otherInput.style.display =
    producer.value === "other" ? "inline-block" : "none"
}

// Insurance Experience
function togglePrevIns() {
  const yesRadio = document.querySelector('input[name="prev-ins"][value="yes"]')
  document.getElementById("prev-ins-name").style.display = yesRadio.checked
    ? "inline-block"
    : "none"
}

// Driver Fields Generation
function generateDriverFields() {
  const count = document.getElementById("driver-count").value || 1
  const container = document.getElementById("driver-fields")
  container.innerHTML = ""

  for (let i = 1; i <= count; i++) {
    const driverHTML = `
      <div class="driver-section">
        <h3>Driver ${i}</h3>
        <input type="text" placeholder="Driver name" class="driver-name" name="driver-${i}-name">
        
        <div class="form-group">
          Convictions: 
          <label><input type="radio" name="convictions-${i}" value="yes" onclick="toggleConviction(this)"> YES</label>
          <label><input type="radio" name="convictions-${i}" value="no" onclick="toggleConviction(this)" checked> NO</label>
          <select class="conviction-count hidden">
            ${createNumberOptions(0, 10)}
          </select>
        </div>

        <div class="form-group">
          Claims: 
          <label><input type="radio" name="claims-${i}" value="yes" onclick="toggleClaims(this)"> YES</label>
          <label><input type="radio" name="claims-${i}" value="no" onclick="toggleClaims(this)" checked> NO</label>
          <div class="claim-fields hidden">
            AF: <select class="af-claims">${createNumberOptions(0, 10)}</select>
            NON-AF: <select class="non-af-claims">${createNumberOptions(
              0,
              10
            )}</select>
          </div>
        </div>

        <div class="lapse-section">
          <button type="button" onclick="addLapseRecord(this)">+ Add Lapse</button>
          <div class="lapse-records"></div>
        </div>
      </div>`
    container.insertAdjacentHTML("beforeend", driverHTML)
  }
}

// Hidden the Number Selection if No Conviction
function toggleConviction(radio) {
  const convictionCount = radio
    .closest(".form-group")
    .querySelector(".conviction-count")
  convictionCount.classList.toggle("hidden", radio.value !== "yes")
}

// Hidden the Number Selection if No Claims
function toggleClaims(radio) {
  const claimsCount = radio
    .closest(".form-group")
    .querySelector(".claim-fields")
  claimsCount.classList.toggle("hidden", radio.value !== "yes")
}

// Lapse Record Management
function addLapseRecord(button) {
  const lapseHTML = `
    <div class="lapse-record">
      From: <input type="text" class="lapse-start" placeholder="YYYY-MM-DD">
      To: <input type="text" class="lapse-end" placeholder="YYYY-MM-DD">
      Reason: 
      <select class="lapse-reason" onchange="toggleOtherReason(this)">
        <option value="no veh no insurance">No veh no insurance</option>
        <option value="out of country">Out of country</option>
        <option value="other">Other</option>
      </select>
      <input type="text" class="other-reason hidden" placeholder="Specify reason">
      <button type="button" onclick="removeLapseRecord(this)">- Remove</button>
    </div>`
  button.parentElement
    .querySelector(".lapse-records")
    .insertAdjacentHTML("beforeend", lapseHTML)
}

function removeLapseRecord(button) {
  button.closest(".lapse-record").remove()
}

function toggleOtherReason(select) {
  const otherInput = select.parentElement.querySelector(".other-reason")
  if (select.value === "other") {
    otherInput.classList.remove("hidden")
  } else {
    otherInput.classList.add("hidden")
  }
}

// Vehicle Coverage Fields Generation
function generateVehicleFields() {
  const count = document.getElementById("vehicle-count").value || 1
  const container = document.getElementById("vehicle-fields")
  container.innerHTML = ""

  for (let i = 1; i <= count; i++) {
    const vehicleHTML = `
      <div class="vehicle-section">
        <h3>Vehicle ${i}</h3>
        <input type="text" placeholder="Vehicle model" class="vehicle-model">
        
        <!-- Class & Rating Section -->
        <div class="form-group">
          <label>
            <input type="checkbox" class="class-rating" onclick="toggleRatingFields(this)">
            Class & Rating
          </label>
        </div>
        <div class="rating-fields hidden">
          <div class="form-group">
            Rating Score:
            <select class="rating-1">${createNumberOptions(
              1,
              20,
              true
            )}</select> /
            <select class="rating-2">${createNumberOptions(0, 9)}</select>*
          </div>
        </div>

        <div class="coverage-options">
          ${createCoverageCheckbox("liab", "$", true, "M LIAB")}
          ${createCoverageCheckbox("all-perils", "ALL PERILS $", true, " DED")}
          ${createCoverageCheckbox(
            "comprehensive",
            "COMPREHENSIVE $",
            true,
            " DED"
          )}
          ${createCoverageCheckbox("collision", "COLLISION $", true, " DED")}  
          ${createCoverageCheckbox("20", "#20 $", true, "")}
          ${createCoverageCheckbox("27", "#27 $", true, "")}
          ${createCoverageCheckbox("accident-waiver", "#39", false, "")}
          ${createCoverageCheckbox("mcp", "MCP", false, "")}
          ${createCoverageCheckbox("43", "#43", false, "")}
          ${createCoverageCheckbox("43a", "#43A", false, "")}
          ${createCoverageCheckbox("5", "#5", false, "")}
          ${createCoverageCheckbox("23a", "#23A", false, "")}
        </div>
      </div>`
    container.insertAdjacentHTML("beforeend", vehicleHTML)
  }
}

// Hidden the Number Selection if No Rating is needed
function toggleRatingFields(checkbox) {
  const ratingFields = checkbox
    .closest(".vehicle-section")
    .querySelector(".rating-fields")
  ratingFields.classList.toggle("hidden", !checkbox.checked)
}

// Create Class and Rating Format
function createNumberOptions(start, end, pad = false) {
  let options = ""
  for (let i = start; i <= end; i++) {
    const value = pad ? i.toString().padStart(2, "0") : i
    options += `<option value="${value}">${value}</option>`
  }
  return options
}

// Create Coverage Format
function createCoverageCheckbox(id, text1, hasAmount = false, text2) {
  if (id === "liab") {
    return `
      <label>
        <input type="checkbox" class="${id}" checked>
        ${text1}
        <select class="coverage-amount">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        ${text2}
      </label>`.replace(/\n\s+/g, "")
  }

  return `
    <label>
      <input type="checkbox" class="${id}">
      ${text1}
      ${hasAmount ? '<input type="text" class="coverage-amount">' : ""}
      ${text2}
    </label>`.replace(/\n\s+/g, "")
}

// In File Checkboxes
function populateInFileCheckboxes() {
  const items = [
    { name: "SIGNED AUTO APP FORM", checked: true },
    { name: "A+/DASH", checked: true },
    { name: "MVR", checked: true },
    { name: "OS", checked: true },
    { name: "BOS", checked: false },
    { name: "DLH", checked: false },
    { name: "DL", checked: false },
    { name: "LOE", checked: false },
    { name: "ABSTRACT", checked: false },
    { name: "VEH PHOTOS", checked: false },
    { name: "WINTER TIRE PHOTO", checked: false },
    { name: "WINTER INVOICE/RECEIPT", checked: false },
    { name: "SIGNED DECLAIM FORM", checked: false },
    { name: "SAFETY STANDARDS CERTIFICATE", checked: false },
    { name: "PAC FORM", checked: false },
    { name: "VOID CHQ", checked: false },
    { name: "MONTHLY PP", checked: false },
    { name: "ANNUALLY PP", checked: false },
  ]

  const container = document.getElementById("in-file-checkboxes")
  items.forEach((item) => {
    container.innerHTML += `
      <label>
        <input type="checkbox" ${item.checked ? "checked" : ""}> 
        ${item.name}
      </label>`
  })
}

// Note Checkboxes
function populateNoteCheckboxes() {
  const notes = [
    { id: "combine", label: "COMBINE WITH PROPERTY POLICY" },
    { id: "enroll", label: "ENROLL", hasInput: true },
    { id: "spouse", label: "SPOUSE UNLICENSED" },
    {
      id: "midterm",
      label: "MIDTERM CANCELLED PREVIOUS INSURANCE DUE TO BETTER PRICE",
    },
    { id: "direct-g", label: "DIRECT G FROM ", hasInput: true },
    {
      id: "winter-tires",
      label: "CLT HAS FOUR WINTER TIRES AND WILL KEEP THEM ON FROM NOV-APR",
    },
    {
      id: "same-day",
      label: "THE APPLICATION WAS SIGNED AND BOUND ON ",
      hasInput: true,
    },
  ]

  const container = document.getElementById("note-checkboxes")
  notes.forEach((note) => {
    container.innerHTML += `
      <div class="note-item">
        <label>
          <input type="checkbox" id="${note.id}"> ${note.label}
          ${note.hasInput ? '<input type="text" class="note-input">' : ""}
        </label>
      </div>`
  })
}

// Generate Note
function generateNote() {
  let noteParts = []

  // Producer
  const producer =
    document.getElementById("producer").value === "other"
      ? document.getElementById("other-producer").value
      : document.getElementById("producer").value
  noteParts.push(`PROD: ${producer.toUpperCase()}`)

  // Previous Insurance
  const prevIns = document.querySelector('input[name="prev-ins"]:checked')
  noteParts.push(
    prevIns.value === "yes"
      ? `PREV INS WITH ${document
          .getElementById("prev-ins-name")
          .value.toUpperCase()}`
      : "NO PREV INS EXP"
  )

  // Vehicles/Drivers
  noteParts.push(
    `${document.getElementById("vehicle-count").value} VEH(S), ${
      document.getElementById("driver-count").value
    } DRIVER(S)`
  )

  // Process Drivers
  let totalConvictions = 0
  let totalAF = 0
  let totalNonAF = 0
  const lapseEntries = []

  document.querySelectorAll(".driver-section").forEach((driver) => {
    const name =
      driver.querySelector(".driver-name").value.toUpperCase() || "UNNAMED"

    // Convictions
    const convictionYes = driver.querySelector(
      'input[type="radio"][value="yes"]:checked'
    )
    if (convictionYes) {
      totalConvictions +=
        parseInt(driver.querySelector(".conviction-count").value) || 0
    }

    // Claims
    const claimYes = driver.querySelector(
      'input[type="radio"][value="yes"]:checked'
    )
    if (claimYes) {
      totalAF += parseInt(driver.querySelector(".af-claims").value) || 0
      totalNonAF += parseInt(driver.querySelector(".non-af-claims").value) || 0
    }

    // Insurance lapses
    driver.querySelectorAll(".lapse-record").forEach((lapse) => {
      const start = lapse.querySelector(".lapse-start").value
      const end = lapse.querySelector(".lapse-end").value
      const reason =
        lapse.querySelector(".lapse-reason").value === "other"
          ? lapse.querySelector(".other-reason").value
          : lapse.querySelector(".lapse-reason").value
      lapseEntries.push(
        `INSURANCE LAPSE FOR ${name} FROM ${start} TO ${end} DUE TO ${reason.toUpperCase()};`
      )
    })
  })

  noteParts.push(
    totalConvictions !== 0
      ? `${totalConvictions} CONVICTION(S)`
      : `NO CONVICTIONS`
  )
  noteParts.push(
    totalAF !== 0 || totalNonAF !== 0
      ? `${totalAF} AF CLAIM(S), ${totalNonAF} NON-AF CLAIM(S)`
      : `NO CLAIMS`
  )

  // Coverage
  const coverageNotes = []
  document.querySelectorAll(".vehicle-section").forEach((vehicle) => {
    const model =
      vehicle.querySelector(".vehicle-model").value.toUpperCase() ||
      "UNKNOWN MODEL"
    let coverageNote = `${model}`

    // Add Class & Rating
    const classRating = vehicle.querySelector(".class-rating").checked
    if (classRating) {
      const rating1 = vehicle.querySelector(".rating-1").value
      const rating2 = vehicle.querySelector(".rating-2").value
      coverageNote += ` - ${rating1}/${rating2}*`
    }

    // Process coverage items
    const items = []
    vehicle
      .querySelectorAll('input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        if (checkbox.classList.contains("class-rating")) return

        const amount = checkbox.parentElement.querySelector(".coverage-amount")
          ? checkbox.classList.contains("coverage-liab")
            ? `${
                checkbox.parentElement.querySelector(".coverage-amount").value
              }M`
            : `$${
                checkbox.parentElement.querySelector(".coverage-amount").value
              }`
          : ""

        let text = checkbox.parentElement.textContent
          .trim()
          .replace("$", amount)

        text = text.replace(/123/gi, "").trim()

        items.push(text)
      })

    // Construct vehicle coverage description properly
    coverageNote += items.length > 0 ? ` - ${items.join(", ")}` : "" // Avoid extra ","
    coverageNotes.push(coverageNote)
  })
  noteParts.push(coverageNotes.join("; "))

  // In File
  const inFileItems = Array.from(
    document.querySelectorAll("#in-file-checkboxes input:checked")
  ).map((cb) => cb.parentElement.textContent.trim())
  noteParts.push(`IN FILE: ${inFileItems.join(", ")}`)

  // Notes
  const noteItems = []
  document
    .querySelectorAll('#note-checkboxes input[type="checkbox"]:checked')
    .forEach((cb) => {
      const text = cb.parentElement.textContent.trim()
      const input = cb.parentElement.querySelector(".note-input")
      noteItems.push(input ? `${text} ${input.value.toUpperCase()}` : text)
    })

  // Add insurance lapses to notes
  if (lapseEntries.length > 0) {
    noteItems.push(...lapseEntries)
  }

  if (noteItems.length > 0) {
    noteParts.push(`NOTE: ${noteItems.join("; ")}`)
  }

  // Uploader
  const uploader =
    document.getElementById("uploader").value === "other"
      ? document.getElementById("other-uploader").value
      : document.getElementById("uploader").value
  noteParts.push(`***UPLOADED BY ${uploader.toUpperCase()}***`)

  // Combine all parts
  document.getElementById("final-note").value = noteParts
    .join(";\n")
    .toUpperCase()
}

function resetForm() {
  document.getElementById("note-form").reset()
  generateVehicleFields()
  generateDriverFields()
  document.getElementById("final-note").value = ""
}
