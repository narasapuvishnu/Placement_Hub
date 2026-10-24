import React, { useEffect, useState } from "react";
import axios from "axios";

const resourceTypes = ["All", "PDF", "Note", "Link", "Study Guide"];
const resourceCategories = ["All", "DSA", "System Design", "SQL", "Aptitude", "Career"];

const typeClass = {
  PDF: "resource-type-pdf",
  Note: "resource-type-note",
  Link: "resource-type-link",
  "Study Guide": "resource-type-guide",
};

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (type !== "All") params.set("type", type);
        if (category !== "All") params.set("category", category);
        if (search.trim()) params.set("search", search.trim());
        const response = await axios.get(`/api/resources?${params.toString()}`);
        setResources(response.data.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [type, category, search]);

  const featuredResources = resources.filter((resource) => resource.featured);

  return (
    <div className="resources-page container py-4 py-lg-5">
      <header className="resources-hero mb-4">
        <div>
          <p className="resources-hero-quote">
            One shelf for your placement prep.
          </p>
        </div>
      </header>

      <section className="resources-toolbar mb-4" aria-label="Resource filters">
        <div className="resource-search-wrap">
          <span aria-hidden="true">Search</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search guides, notes, or topics"
            aria-label="Search resources"
          />
        </div>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
          {resourceCategories.map((option) => <option key={option} value={option}>{option === "All" ? "All areas" : option}</option>)}
        </select>
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by resource type">
          {resourceTypes.map((option) => <option key={option} value={option}>{option === "All" ? "All formats" : option}</option>)}
        </select>
      </section>

      {featuredResources.length > 0 && (
        <section className="mb-5">
          <div className="resources-section-heading">
            <div>
              <span className="resources-eyebrow">Start here</span>
              <h2>Editor picks</h2>
            </div>
            <span>{featuredResources.length} selected resources</span>
          </div>
          <div className="row g-3">
            {featuredResources.map((resource) => <ResourceCard key={resource._id} resource={resource} featured />)}
          </div>
        </section>
      )}

      <section>
        <div className="resources-section-heading">
          <div>
            <span className="resources-eyebrow">Library</span>
            <h2>All resources</h2>
          </div>
          <span>{resources.length} available</span>
        </div>
        {loading ? (
          <div className="resources-empty">Loading your resource shelf...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : resources.length === 0 ? (
          <div className="resources-empty">No resources match these filters.</div>
        ) : (
          <div className="row g-3">
            {resources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)}
          </div>
        )}
      </section>
    </div>
  );
};

const ResourceCard = ({ resource, featured = false }) => (
  <div className={featured ? "col-lg-4" : "col-md-6 col-xl-4"}>
    <article className={`resource-card h-100 ${featured ? "resource-card-featured" : ""}`}>
      <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
        <span className={`resource-type ${typeClass[resource.resourceType] || ""}`}>{resource.resourceType}</span>
        <span className="resource-category">{resource.category}</span>
      </div>
      <h3>{resource.title}</h3>
      <p>{resource.description}</p>
      <div className="resource-tags">
        {resource.tags?.map((tag) => <span key={tag}>#{tag}</span>)}
      </div>
      <div className="resource-card-footer">
        <span>{resource.source} · {resource.readTime}</span>
        <a href={resource.url} target="_blank" rel="noreferrer">
          {resource.resourceType === "PDF" ? "Open PDF" : "Open resource"} ↗
        </a>
      </div>
    </article>
  </div>
);

export default Resources;
