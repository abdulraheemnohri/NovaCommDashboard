import React, { useState, useEffect } from 'react';
import { getNodes, getPackets } from '../api/apiClient';
import useWebSocket from '../lib/useWebSocket';
import OverviewStats from '../components/OverviewStats';
import NodeMap from '../components/NodeMap';
import PacketStats from '../components/PacketStats';

const Dashboard = () => {
  const [nodes, setNodes] = useState([]);
  const [packets, setPackets] = useState([]);

  const wsMessage = useWebSocket('ws://127.0.0.1:8000/ws');

  useEffect(() => {
    const fetchData = async () => {
      const nodesResponse = await getNodes();
      setNodes(nodesResponse.data);
      const packetsResponse = await getPackets();
      setPackets(packetsResponse.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (wsMessage) {
      if (wsMessage.type === 'new_packet') {
        setPackets((prevPackets) => [...prevPackets, wsMessage.data]);
        setNodes((prevNodes) => {
          const existingNodeIndex = prevNodes.findIndex(node => node.uuid === wsMessage.data.node_id); // node_id in packet is uuid
          if (existingNodeIndex !== -1) {
            const updatedNodes = [...prevNodes];
            updatedNodes[existingNodeIndex] = { ...updatedNodes[existingNodeIndex], status: 'online', last_seen: new Date().toISOString() };
            return updatedNodes;
          } else {
            return [...prevNodes, { uuid: wsMessage.data.node_id, name: `Node ${wsMessage.data.node_id}`, status: 'online', last_seen: new Date().toISOString(), lat: null, lng: null, mode: 'normal' }];
          }
        });
      } else if (wsMessage.type === 'new_node') {
        setNodes((prevNodes) => [...prevNodes, wsMessage.data]);
      } else if (wsMessage.type === 'node_update') {
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.uuid === wsMessage.data.uuid ? wsMessage.data : node
          )
        );
      } else if (wsMessage.type === 'node_deleted') {
        setNodes((prevNodes) =>
          prevNodes.filter((node) => node.uuid !== wsMessage.data.uuid)
        );
      } else if (wsMessage.type === 'new_ota_task') {
        // Handle new OTA task notification if needed on dashboard
        console.log("New OTA Task:", wsMessage.data);
      } else if (wsMessage.type === 'ota_task_update') {
        // Handle OTA task progress update if needed on dashboard
        console.log("OTA Task Update:", wsMessage.data);
      } else if (wsMessage.type === 'new_job') {
        console.log("New Job:", wsMessage.data);
      } else if (wsMessage.type === 'job_deleted') {
        console.log("Job Deleted:", wsMessage.data);
      } else if (wsMessage.type === 'new_alert') {
        console.log("New Alert:", wsMessage.data);
      } else if (wsMessage.type === 'alert_updated') {
        console.log("Alert Updated:", wsMessage.data);
      } else if (wsMessage.type === 'new_ai_log') {
        console.log("New AI Log:", wsMessage.data);
      }
    }
  }, [wsMessage]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <OverviewStats nodes={nodes} packets={packets} />
      <NodeMap nodes={nodes} />
      <PacketStats packets={packets} />
    </div>
  );
};

export default Dashboard;
