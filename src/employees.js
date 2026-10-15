/** One digital card per employee ID. Add new people here. */
export const employees = {
  "00-0001": {
    empId: "00-0001",
    name: "Gad KALISA",
    firstName: "Gad",
    lastName: "KALISA",
    position: "Founder / CEO",
    company: "TAPMELTD",
    email: "kalisagad05@gmail.com",
    tel: "+250 7919 998 365",
    photo: "/0001.webp",
  },

  "00-0003": {
    empId: "00-0003",
    name: "Jennifer NYANGOMA",
    firstName: "Jennifer",
    lastName: "NYANGOMA",
    position: "Head of Finance",
    company: "TAPMELTD",
    email: "jennifernyangoma6@gmail.com",
    tel: "+250 798 540 820",
    photo: "/0003.webp",
  },
};

export const DEFAULT_EMPLOYEE_ID = "00-0001";

export function getEmployeeIdFromUrl() {
  const pathId = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (pathId && employees[pathId]) return pathId;

  // Support old ?id= links by redirecting to /00-0001 style routes
  const fromQuery = new URLSearchParams(window.location.search).get("id");
  if (fromQuery && employees[fromQuery]) return fromQuery;

  return DEFAULT_EMPLOYEE_ID;
}

export function getEmployee(id = getEmployeeIdFromUrl()) {
  return employees[id] ?? employees[DEFAULT_EMPLOYEE_ID];
}

/** Keep the browser URL as /00-0001 */
export function syncEmployeeRoute() {
  const id = getEmployeeIdFromUrl();
  const target = `/${id}`;

  if (window.location.pathname !== target || window.location.search) {
    window.history.replaceState(null, "", target);
  }

  return id;
}

export function getEmployeePageTitle(employee) {
  return `${employee.name} | ${employee.email} | ${employee.tel}`;
}

export function applyEmployeeSeo(employee) {
  const title = getEmployeePageTitle(employee);
  document.title = title;

  const description = `${employee.name} — TapMe ${employee.position}. Email ${employee.email}, Tel ${employee.tel}. WhatsApp 0787 391 113, call 0799 646 246, email tapmeltd@gmail.com. Kigali, Rwanda.`;

  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement("meta");
    descTag.setAttribute("name", "description");
    document.head.appendChild(descTag);
  }
  descTag.setAttribute("content", description);

  const setOg = (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", property);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  setOg("og:title", title);
  setOg("og:description", `${employee.name} · ${employee.email} · ${employee.tel}`);
  setOg("og:image", employee.photo || "/tapme-logo.png");
}
