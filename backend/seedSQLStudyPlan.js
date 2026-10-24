require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const connectDB = require("./config/db");
const Question = require("./models/Question");

const starter = "-- Write your SQL query here\n";
const sql = (question) => ({
  category: "SQL",
  questionType: "coding",
  difficulty: "Easy",
  tags: ["SQL", question.topic],
  companies: ["Google", "Amazon", "Microsoft"],
  starterCode: { mysql: starter, postgresql: starter, sql: starter },
  sampleCases: [],
  acceptanceRate: 75,
  ...question,
});

const topicUpdates = {
  "Department Highest Salary": "Basic Joins",
  "Recyclable and Low Fat Products": "Select",
  "Find Customer Referee": "Select",
  "Big Countries": "Select",
  "Second Highest Salary": "Subqueries",
  "Consecutive Numbers": "Aggregate Functions",
  "Department Top Three Salaries": "Aggregate Functions",
  "Rising Temperature": "Basic Joins",
};

const questions = [
  sql({
    title: "Article Views I",
    topic: "Select",
    description: "From the Views table, return the ids of authors who viewed at least one of their own articles. Return each author id once and sort the result in ascending order.",
    inputFormat: "Views(article_id, author_id, viewer_id, view_date)",
    outputFormat: "author_id",
    constraints: ["An author may view an article more than once."],
    sampleCases: [{ input: "Views: author 7 viewed article 10 as viewer 7", output: "7", explanation: "The author and viewer ids match." }],
    hints: ["Filter rows where author_id equals viewer_id.", "Use DISTINCT to remove repeated views."],
    solutionApproach: "Select distinct author ids from rows where the author is also the viewer, then order them.",
  }),
  sql({
    title: "Products That Are Both Safe and Recyclable",
    topic: "Select",
    description: "Return the product ids for products marked both low-fat and recyclable. This is a filtering exercise over two categorical columns.",
    inputFormat: "Products(product_id, low_fats, recyclable)",
    outputFormat: "product_id",
    sampleCases: [{ input: "Products: (1, 'Y', 'Y'), (2, 'Y', 'N')", output: "1", explanation: "Only product 1 satisfies both predicates." }],
    hints: ["Combine two equality predicates with AND."],
    solutionApproach: "Use a WHERE clause requiring both flags to be Y.",
  }),
  sql({
    title: "Customers Without a Referee",
    topic: "Select",
    description: "Return customer names whose referee is not customer 2. Customers without a referee should also be included.",
    inputFormat: "Customer(id, name, referee_id)",
    outputFormat: "name",
    sampleCases: [{ input: "Customer 1 has referee NULL; customer 2 has referee 2", output: "Customer 1", explanation: "NULL referee values are included." }],
    hints: ["NULL needs an explicit IS NULL condition."],
    solutionApproach: "Filter for referee_id not equal to 2 or referee_id IS NULL.",
  }),
  sql({
    title: "Employees and Their Departments",
    topic: "Basic Joins",
    description: "Return every employee name together with the name of the department they belong to. Include employees whose department record is missing.",
    inputFormat: "Employee(id, name, department_id), Department(id, name)",
    outputFormat: "employee_name, department_name",
    sampleCases: [{ input: "Employee Ada has department 4; Department 4 is Engineering", output: "Ada | Engineering", explanation: "The department id connects the two tables." }],
    hints: ["Use a LEFT JOIN when the employee must remain in the result."],
    solutionApproach: "Left join Department on the foreign-key relationship and select both names.",
  }),
  sql({
    title: "Employees Earning More Than Their Managers",
    topic: "Basic Joins",
    description: "Find employees whose salary is greater than the salary of their direct manager.",
    inputFormat: "Employee(id, name, salary, manager_id)",
    outputFormat: "employee name",
    sampleCases: [{ input: "Manager earns 80, employee earns 95", output: "Employee", explanation: "The employee salary is higher." }],
    hints: ["Join Employee to itself: one alias for the employee and one for the manager."],
    solutionApproach: "Self-join manager_id to the manager's id, then compare the two salary columns.",
  }),
  sql({
    title: "Daily Temperature Increase",
    topic: "Basic Joins",
    description: "Return the ids of weather records whose temperature is greater than the previous calendar day's temperature.",
    inputFormat: "Weather(id, record_date, temperature)",
    outputFormat: "id",
    sampleCases: [{ input: "Jan 1: 10, Jan 2: 14", output: "2", explanation: "The second day's temperature increased." }],
    hints: ["Self-join on a one-day date difference."],
    solutionApproach: "Join today's record to yesterday's record and compare temperatures.",
  }),
  sql({
    title: "Subjects Taught by Each Teacher",
    topic: "Aggregate Functions",
    description: "For each teacher, count the number of distinct subjects taught across all departments.",
    inputFormat: "Teacher(teacher_id, subject_id, department_id)",
    outputFormat: "teacher_id, distinct_subject_count",
    sampleCases: [{ input: "Teacher 1 teaches subject 5 in two departments", output: "1 | 1", explanation: "The subject is counted once." }],
    hints: ["COUNT(DISTINCT subject_id) prevents duplicate subjects."],
    solutionApproach: "Group by teacher_id and count distinct subject ids.",
  }),
  sql({
    title: "Classes With At Least Five Students",
    topic: "Aggregate Functions",
    description: "Return class names that have at least five enrolled students.",
    inputFormat: "Courses(student, class)",
    outputFormat: "class",
    sampleCases: [{ input: "Algorithms has 5 students; Databases has 3", output: "Algorithms", explanation: "Only classes meeting the threshold remain." }],
    hints: ["Group by class and filter groups with HAVING."],
    solutionApproach: "Count students per class and use HAVING COUNT(*) >= 5.",
  }),
  sql({
    title: "Average Selling Price by Product",
    topic: "Aggregate Functions",
    description: "Calculate the weighted average selling price for each product using its units sold during each price period.",
    inputFormat: "Prices(product_id, start_date, end_date, price), UnitsSold(product_id, purchase_date, units)",
    outputFormat: "product_id, average_price rounded to two decimals",
    sampleCases: [{ input: "Product 1 sold 2 units at 10 and 3 units at 20", output: "16.00", explanation: "(2*10 + 3*20) / 5 = 16." }],
    hints: ["Join purchases to the price interval containing the purchase date.", "Use SUM(price * units) / SUM(units)."],
    solutionApproach: "Join by product and date range, then calculate the weighted average per product.",
  }),
  sql({
    title: "Second Highest Distinct Salary",
    topic: "Subqueries",
    difficulty: "Medium",
    description: "Return the second highest distinct salary from Employee. If no second salary exists, return NULL.",
    inputFormat: "Employee(id, salary)",
    outputFormat: "second_highest_salary",
    sampleCases: [{ input: "Salaries: 100, 200, 200, 300", output: "200", explanation: "Distinct salary levels are 300, 200, 100." }],
    hints: ["Exclude the maximum salary in an inner query.", "MAX over the remaining values naturally returns NULL when empty."],
    solutionApproach: "Use a subquery to find the maximum salary below the overall maximum.",
  }),
  sql({
    title: "Customers Who Never Placed an Order",
    topic: "Subqueries",
    description: "Return customers who do not appear in the Orders table.",
    inputFormat: "Customers(id, name), Orders(id, customer_id)",
    outputFormat: "customer name",
    sampleCases: [{ input: "Customers 1,2; Orders contains customer 1", output: "Customer 2", explanation: "Customer 2 has no matching order." }],
    hints: ["NOT EXISTS avoids duplicate results and handles the missing relationship directly."],
    solutionApproach: "Select customers for whom no order exists with the same customer id.",
  }),
  sql({
    title: "Department Top Three Salary Levels",
    topic: "Subqueries",
    difficulty: "Hard",
    description: "Return employees whose salary belongs to one of the three highest distinct salary levels in their department.",
    inputFormat: "Employee(id, name, salary, department_id), Department(id, name)",
    outputFormat: "department, employee, salary",
    sampleCases: [{ input: "A department has salary levels 100, 90, 80, 70", output: "Employees earning 100, 90, or 80", explanation: "The top three distinct levels are retained." }],
    hints: ["DENSE_RANK is useful when tied salaries share a rank."],
    solutionApproach: "Rank salaries within each department in descending order and filter ranks one through three.",
  }),
  sql({
    title: "Invalid Usernames",
    topic: "Advanced String Functions",
    description: "Return usernames that contain characters outside letters, digits, and underscores, or whose length is outside 3 to 16 characters.",
    inputFormat: "Users(user_id, username)",
    outputFormat: "user_id, username",
    sampleCases: [{ input: "'alex_7' is valid; 'a!' is invalid", output: "a!", explanation: "The second username contains an invalid symbol and is too short." }],
    hints: ["Use a regular-expression predicate if your SQL dialect supports it.", "Check length separately for portability."],
    solutionApproach: "Combine a length range check with a negated allowed-character pattern.",
  }),
  sql({
    title: "Normalize Customer Names",
    topic: "Advanced String Functions",
    description: "Return each customer name with its first character uppercase and every remaining character lowercase.",
    inputFormat: "Users(user_id, name)",
    outputFormat: "user_id, normalized_name ordered by id",
    sampleCases: [{ input: "'aLICE'", output: "'Alice'", explanation: "Only the first character is uppercase." }],
    hints: ["Combine UPPER, LOWER, LEFT, and SUBSTRING.", "Be explicit about the starting index of the substring."],
    solutionApproach: "Uppercase the first character and concatenate it with the lowercase remainder.",
  }),
  sql({
    title: "Remove Duplicate Emails",
    topic: "Advanced String Functions",
    description: "Delete duplicate email records while keeping the row with the smallest id for each email address.",
    inputFormat: "Person(id, email)",
    outputFormat: "The de-duplicated Person table",
    sampleCases: [{ input: "(1, a@x.com), (2, a@x.com), (3, b@x.com)", output: "Rows 1 and 3", explanation: "The earliest id is retained." }],
    hints: ["A self-join can identify a row with a smaller duplicate id.", "A window function is another option."],
    solutionApproach: "Delete rows whose email has another row with a smaller id, or rank rows by id and keep rank one.",
  }),
];

async function seedSQLStudyPlan() {
  try {
    await connectDB();

    for (const [title, topic] of Object.entries(topicUpdates)) {
      await Question.updateOne({ title, category: "SQL" }, { $set: { topic } });
    }

    for (const question of questions) {
      await Question.findOneAndUpdate({ title: question.title }, question, { upsert: true, returnDocument: "after" });
      console.log(`Seeded SQL study-plan problem: ${question.title}`);
    }

    console.log(`Categorized existing SQL problems and seeded ${questions.length} new SQL study-plan problems.`);
    process.exit(0);
  } catch (error) {
    console.error("SQL study-plan seed failed:", error);
    process.exit(1);
  }
}

seedSQLStudyPlan();
