import React, { useEffect, useState } from "react";
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { useApiRequest } from "../../utils/useApiRequest";
import EditMember from "./EditMember";
import EditExpert from "./EditExpert";
import EditExpertise from "./EditExpertise";

interface EditProfileProps {
  memberId?: number; // optional: only provided by admin
}

const EditProfile: React.FC<EditProfileProps> = ({ memberId }) => {
  const { apiRequest } = useApiRequest();
  const [activeTab, setActiveTab] = useState("member");
  const [userData, setUserData] = useState<any>(null);
  const [expertData, setExpertData] = useState<any>(null);
  const [expertiseData, setExpertiseData] = useState<any[]>([]);
  const [isExpert, setIsExpert] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const userEndpoint = memberId ? `users/${memberId}/` : "users/me/";
      const user = await apiRequest(userEndpoint);
      if (user) {
        setUserData(user);

        if (user.role === "expert") {
          setIsExpert(true);
          const expertEndpoint = memberId ? `experts/by_user/${memberId}/` : "experts/me/";
          const expert = await apiRequest(expertEndpoint);
          let expertises: any[] = [];
          if (expert) {
            expertises = await apiRequest(`expertises/by_expert/${expert.id}/`) || [];
          }
          setExpertiseData(expertises);

          setExpertData(expert);
          setExpertiseData(expertises || []);
        }
      }
    };
    fetchAll();
  }, [memberId, apiRequest]);

  const toggleTab = (tab: string) => setActiveTab(tab);

  return (
    <Container className="mt-4">
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "member" })}
            onClick={() => toggleTab("member")}
          >
            Member Info
          </NavLink>
        </NavItem>

        {isExpert && (
          <>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "expert" })}
                onClick={() => toggleTab("expert")}
              >
                Expert Profile
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "expertise" })}
                onClick={() => toggleTab("expertise")}
              >
                Expertise
              </NavLink>
            </NavItem>
          </>
        )}
      </Nav>

      <TabContent activeTab={activeTab} className="p-3 border border-top-0 bg-light">
        <TabPane tabId="member">
          {userData && <EditMember data={userData} onSave={() => {}} />}
        </TabPane>

        <TabPane tabId="expert">
          {expertData && <EditExpert data={expertData} onSave={() => {}} />}
        </TabPane>

        <TabPane tabId="expertise">
          {expertiseData.map((item, idx) => (
            <EditExpertise key={item.id || idx} data={item} onSave={() => {}} />
          ))}
        </TabPane>
      </TabContent>
    </Container>
  );
};

export default EditProfile;
