import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { useApiRequest } from "../../utils/useApiRequest";
import { getRandomPlaceholderImage } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

interface Expert {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    city: string;
    state: string;
    local_group: {
      group_name: string;
    } | null;
  };
  occupation: string;
  industry: {
    id: number;
    industry_name: string;
  } | null;
  background: string;
  availability_status: string;
  show_contact_info: boolean;
  photo?: string;
  expertise?: {
    area_of_expertise_name?: string;
    what_offering: string;
    who_would_benefit: string;
    why_choose_you: string;
    skills_not_offered: string;
  }[];
}

const Experts: React.FC = () => {
  const { apiRequest } = useApiRequest();
  const { user } = useAuth();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Dropdown states
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  useEffect(() => {
    document.title = "Experts | Network of American Mensa Member Experts";
  }, []);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setIsLoading(true);
        const apiExperts: any[] = await apiRequest("users/experts/");
        
        if (!apiExperts || !Array.isArray(apiExperts)) {
          throw new Error("Invalid response from API");
        }

        // API response received successfully

        // Transform API response to match the expected Expert interface
        const transformedExperts: Expert[] = apiExperts.map((expert) => ({
          id: expert.id,
          user: {
            id: expert.id,
            username: expert.username || "",
            first_name: expert.first_name || "",
            last_name: expert.last_name || "",
            city: expert.city || "",
            state: expert.state || "",
            local_group: expert.local_group || null,
          },
          occupation: expert.occupation || "",
          industry: expert.industry ? {
            id: expert.industry.id,
            industry_name: expert.industry.industry_name,
          } : null,
          background: expert.background || "",
          availability_status: expert.availability_status || "",
          show_contact_info: expert.show_contact_info || false,
          photo: expert.photo || getRandomPlaceholderImage(), // Assign placeholder once during transformation
          expertise: expert.expertise || [],
        }));

        // Data transformation completed

        setExperts(transformedExperts);
        setFilteredExperts(transformedExperts);
      } catch (error) {
        console.error("Failed to fetch experts:", error);
        setError("Failed to load experts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperts();
  }, []);

  useEffect(() => {
    let filtered = [...experts];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((expert) => {
        // Search through all expertise records for area_of_expertise_name and what_offering
        const hasMatchingExpertise = expert.expertise?.some(exp => {
          const areaOfExpertise = exp.area_of_expertise_name?.toLowerCase() || '';
          const whatOffering = exp.what_offering?.toLowerCase() || '';
          return areaOfExpertise.includes(searchLower) || whatOffering.includes(searchLower);
        });
        
        return hasMatchingExpertise || false;
      });
    }

    // Apply area of expertise filter
    if (industryFilter) {
      filtered = filtered.filter(expert => 
        expert.expertise?.some(exp => exp.area_of_expertise_name === industryFilter)
      );
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter(expert => 
        expert.user.local_group?.group_name === locationFilter
      );
    }

    // Sort alphabetically by last name, then first name
    filtered.sort((a, b) => {
      const lastNameCompare = (a.user.last_name || '').localeCompare(b.user.last_name || '');
      if (lastNameCompare !== 0) {
        return lastNameCompare;
      }
      return (a.user.first_name || '').localeCompare(b.user.first_name || '');
    });

    setFilteredExperts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [experts, searchTerm, industryFilter, locationFilter]);

  // Get unique values for filter dropdowns (memoized for performance)
  const areasOfExpertise = useMemo(() => {
    return [...new Set(
      experts.flatMap(expert => 
        expert.expertise?.map(exp => exp.area_of_expertise_name).filter(Boolean) || []
      )
    )].sort(); // Sort alphabetically
  }, [experts]);
  
  const locations = useMemo(() => {
    return [...new Set(experts.map(expert => expert.user.local_group?.group_name).filter(Boolean))].sort(); // Sort alphabetically
  }, [experts]);

  // Pagination logic
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperts = filteredExperts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setIndustryFilter("");
    setLocationFilter("");
  };

  const handleSearch = () => {
    // The search is already handled by the useEffect when searchTerm changes
    // This function can be used for additional search logic if needed
    setCurrentPage(1); // Reset to first page when searching
  };

  // Check if user status is pending
  if (user && user.status === "pending") {
    return (
      <div>
        <Alert color="warning" className="mb-4">
          <h5 className="alert-heading">Account Pending Verification</h5>
          <p>
            Your account is pending until your membership is verified. This will be completed within 48 hours.
          </p>
          <p className="mb-0">
            In the meantime, you can edit your profile and expertise. Once your membership is verified, you'll have full access to browse experts and their profiles.
          </p>
        </Alert>
        <div className="text-center">
          <Button color="primary" tag={Link} to="/profile" size="lg">
            Edit My Profile
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner color="primary" />
        <p className="mt-2">Loading experts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert color="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div>
        {/* Main Title and Subtitle */}
        <div className="mb-3">
          <h1 className="mb-3" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
            Find a Mensa member expert
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>
          Search by keyword (e.g.: real estate, baseball, genomics, lawyer, publishing)
          </p>
        </div>

        {/* Search by Keyword Section */}
        <div className="mb-5">
          <div className="d-flex gap-2 mb-3">
            <Input
              id="keyword-search"
              type="text"
              placeholder="e.g., lawyer, MLOps, violin"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontStyle: 'italic' }}
              className="flex-grow-1"
            />
            <Button 
              color="primary" 
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Filters and Sort Controls */}
        <Row className="mb-4 align-items-center">
          <Col xs="12" md="4" className="mb-3 mb-md-0">
            <p className="text-muted mb-0">
              Showing {startIndex + 1}-{startIndex + currentExperts.length} of {filteredExperts.length} experts
              {(searchTerm || industryFilter || locationFilter) && (
                <span> (filtered from {experts.length} total)</span>
              )}
            </p>
          </Col>
          <Col xs="12" md="8">
            <div className="d-flex justify-content-md-end align-items-center gap-3 flex-wrap">
              <span className="text-muted">Area of expertise:</span>
              <Dropdown isOpen={industryDropdownOpen} toggle={() => setIndustryDropdownOpen(!industryDropdownOpen)}>
                <DropdownToggle caret size="sm">
                  {industryFilter || 'All Areas of Expertise'}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setIndustryFilter('')}>All Areas of Expertise</DropdownItem>
                  {areasOfExpertise.map(area => (
                    <DropdownItem key={area} onClick={() => setIndustryFilter(area || '')}>
                      {area}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <span className="text-muted">Local Group:</span>
              <Dropdown isOpen={locationDropdownOpen} toggle={() => setLocationDropdownOpen(!locationDropdownOpen)}>
                <DropdownToggle caret size="sm">
                  {locationFilter || 'All Local Groups'}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setLocationFilter('')}>All Local Groups</DropdownItem>
                  {locations.map(location => (
                    <DropdownItem key={location} onClick={() => setLocationFilter(location || '')}>
                      {location}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <Button color="secondary" onClick={clearFilters} size="sm">
                Clear Filters
              </Button>
            </div>
          </Col>
        </Row>

        {/* Expert Cards/List */}
      {currentExperts.length === 0 ? (
        <Alert color="info" className="text-center">
          {searchTerm || industryFilter || locationFilter 
            ? "No experts found matching your criteria. Try adjusting your filters." 
            : "No experts available at the moment."}
        </Alert>
      ) : (
        <>
          <Row>
              {currentExperts.map((expert) => (
                <Col md="6" lg="4" key={expert.id} className="mb-4">
                  <Card className="h-100 expert-card" style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}>
                    <CardBody className="p-4 d-flex flex-column">
                      {/* Photo */}
                      <div className="text-center mb-3">
                        <img
                          src={expert.photo}
                          alt={`${expert.user.first_name} ${expert.user.last_name}`}
                          className="rounded-circle"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                      </div>
                      
                      {/* Name */}
                      <h5 className="text-center mb-2" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                        {expert.user.first_name} {expert.user.last_name}
                      </h5>
                      
                      {/* Local Group */}
                      <p className="text-center text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                        {expert.user.local_group?.group_name || 'No local group'}
                      </p>
                      
                      {/* Divider */}
                      <hr className="my-3" />
                      
                      {/* Expertise List - Wrapped in flex-grow container to push button to bottom */}
                      <div className="flex-grow-1">
                        {expert.expertise && expert.expertise.length > 0 && (
                          <div className="mb-4">
                            {expert.expertise.map((exp, index) => (
                              <div key={index} className="mb-3" style={{ fontSize: '0.85rem' }}>
                                {exp.area_of_expertise_name && (
                                  <p className="mb-1" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    {exp.area_of_expertise_name}
                                  </p>
                                )}
                                {exp.what_offering && (
                                  <p className="text-muted" style={{ lineHeight: '1.4' }}>
                                    {exp.what_offering.length > 100 
                                      ? `${exp.what_offering.substring(0, 100)}...` 
                                      : exp.what_offering}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        <Button
                          color="primary"
                          size="sm"
                          tag={Link}
                          to={`/expert/${expert.user.id}`}
                          className="flex-fill"
                        >
                          See full profile
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row className="mt-4">
              <Col md="12">
                <Pagination className="justify-content-center">
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page} active={page === currentPage}>
                      <PaginationLink onClick={() => handlePageChange(page)}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem disabled={currentPage === totalPages}>
                    <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                </Pagination>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default Experts;
