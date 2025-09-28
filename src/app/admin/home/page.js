"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { db } from "@/lib/firebase";
import { dbSolicitacoes } from "@/lib/firebase-solicitacoes";
import { collection, getDocs } from "firebase/firestore";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import {
  FaProjectDiagram,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboard() {
  const [projetos, setProjetos] = useState({
    total: 0,
    andamento: 0,
    concluido: 0,
    cancelado: 0,
    tempoEntrega: 0,
    tempoConclusao: 0,
    historicoConclusao: [],
  });

  const [solicitacoes, setSolicitacoes] = useState({
    total: 0,
    andamento: 0,
    concluido: 0,
    cancelado: 0,
    novas: 0,
    historicoMensal: [],
  });

  const [graficoIndex, setGraficoIndex] = useState(0);

  const links = [
    { href: "/admin/home", label: "Dashboard" },
    { href: "/admin/usuarios", label: "Usuários" },
    { href: "/admin/projetos", label: "Projetos" },
    { href: "/admin/solicitacoes", label: "Solicitações" },
    { href: "/admin/logs", label: "Logs" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ----------- Projetos -----------
        const projSnap = await getDocs(collection(db, "projetos"));
        let total = projSnap.size;
        let andamento = 0,
          concluido = 0,
          cancelado = 0;

        let somaEntrega = 0,
          countEntrega = 0;
        let somaConclusao = 0,
          countConclusao = 0;

        let historico = {};

        projSnap.docs.forEach((doc) => {
          const data = doc.data();
          const status = data.status;

          if (status === "em andamento") andamento++;
          else if (status === "concluido") concluido++;
          else if (status === "cancelado") cancelado++;

          if (data.criadoEm && data.dataEntrega) {
            const diff = data.dataEntrega.toDate() - data.criadoEm.toDate();
            somaEntrega += diff;
            countEntrega++;
          }

          if (data.criadoEm && data.dataConclusao) {
            const diff = data.dataConclusao.toDate() - data.criadoEm.toDate();
            somaConclusao += diff;
            countConclusao++;

            const mesAno = data.dataConclusao
              .toDate()
              .toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" });
            historico[mesAno] = (historico[mesAno] || 0) + 1;
          }
        });

        const historicoArray = Object.entries(historico)
          .map(([mes, qtd]) => ({ mes, qtd }))
          .sort((a, b) => {
            const [m1, y1] = a.mes.split("/");
            const [m2, y2] = b.mes.split("/");
            return new Date(y1, m1 - 1) - new Date(y2, m2 - 1);
          });

        setProjetos({
          total,
          andamento,
          concluido,
          cancelado,
          tempoEntrega:
            countEntrega > 0
              ? Math.round(somaEntrega / countEntrega / (1000 * 60 * 60 * 24))
              : 0,
          tempoConclusao:
            countConclusao > 0
              ? Math.round(somaConclusao / countConclusao / (1000 * 60 * 60 * 24))
              : 0,
          historicoConclusao: historicoArray,
        });

        // ----------- Chamados (Solicitações) -----------
        const solSnap = await getDocs(collection(dbSolicitacoes, "chamados"));
        let sTotal = solSnap.size;
        let sAndamento = 0,
          sConcluido = 0,
          sCancelado = 0,
          sNovas = 0;

        let historicoMes = {};

        solSnap.docs.forEach((doc) => {
          const data = doc.data();
          const status = data.status;

          if (status === "em andamento") sAndamento++;
          else if (status === "concluido") sConcluido++;
          else if (status === "cancelado") sCancelado++;
          else if (status === "pendente") sNovas++;

          if (data.criadoEm) {
            const mesAno = data.criadoEm
              .toDate()
              .toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" });
            historicoMes[mesAno] = (historicoMes[mesAno] || 0) + 1;
          }
        });

        const historicoMensalArray = Object.entries(historicoMes)
          .map(([mes, qtd]) => ({ mes, qtd }))
          .sort((a, b) => {
            const [m1, y1] = a.mes.split("/");
            const [m2, y2] = b.mes.split("/");
            return new Date(y1, m1 - 1) - new Date(y2, m2 - 1);
          });

        setSolicitacoes({
          total: sTotal,
          andamento: sAndamento,
          concluido: sConcluido,
          cancelado: sCancelado,
          novas: sNovas,
          historicoMensal: historicoMensalArray,
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      }
    };

    fetchData();
  }, []);

  const [solicitacoesGrafico, setSolicitacoesGrafico] = useState(0); // 0 = Barras, 1 = Pizza


  const pieData = [
    { name: "Em andamento", value: projetos.andamento },
    { name: "Concluídos", value: projetos.concluido },
    { name: "Cancelados", value: projetos.cancelado },
  ];
  const COLORS = ["#6366F1", "#10B981", "#EF4444"];

  const graficos = [
    {
      titulo: "Distribuição por Status",
      content: (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ),
    },
    {
      titulo: "Conclusões ao longo do tempo",
      content: (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projetos.historicoConclusao}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="qtd" stroke="#6366F1" />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar links={links} />

      <main className="flex-1 p-8 w-full overflow-y-auto h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* -------- Projetos -------- */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Projetos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <Card icon={<FaClock />} label="Média até entrega (dias)" value={projetos.tempoEntrega} time />
              <Card icon={<FaClock />} label="Média até conclusão (dias)" value={projetos.tempoConclusao} time />
              <Card icon={<FaClipboardList />} label="Em andamento" value={projetos.andamento} />
              <Card icon={<FaCheckCircle />} label="Concluídos" value={projetos.concluido} />
              <Card icon={<FaTimesCircle />} label="Cancelados" value={projetos.cancelado} />
              <Card icon={<FaProjectDiagram />} label="Totais" value={projetos.total} totais />
            </div>

            {/* Carousel de Gráficos */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md mt-12 relative">
              <h3 className="text-lg font-semibold mb-4 text-center">
                {graficos[graficoIndex].titulo}
              </h3>
              {graficos[graficoIndex].content}

              {/* Botões de navegação */}
              <button
                onClick={() =>
                  setGraficoIndex((prev) =>
                    prev === 0 ? graficos.length - 1 : prev - 1
                  )
                }
                className="absolute -left-5 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-3 py-1 rounded-full shadow hover:scale-110 hover:-left-7 hover:cursor-pointer transition-all"
              >
                <IoMdArrowDropleft size={20} />
              </button>
              <button
                onClick={() =>
                  setGraficoIndex((prev) =>
                    prev === graficos.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute -right-5 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-3 py-1 rounded-full shadow hover:scale-110 hover:-right-7 hover:cursor-pointer transition-all"
              >
                <IoMdArrowDropright size={20} />
              </button>
            </div>
          </section>

          {/* -------- Solicitações -------- */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Solicitações
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <Card
                icon={<FaEnvelopeOpenText />}
                label="Novas Solicitações"
                value={solicitacoes.novas}
                highlight
              />
              <Card icon={<FaClipboardList />} label="Em andamento" value={solicitacoes.andamento} />
              <Card icon={<FaCheckCircle />} label="Concluídas" value={solicitacoes.concluido} />
              <Card icon={<FaTimesCircle />} label="Canceladas" value={solicitacoes.cancelado} />
              <Card icon={<FaProjectDiagram />} label="Totais" value={solicitacoes.total} totais />
            </div>

            {/* Carousel de Gráficos */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md mt-12 relative">
              <h3 className="text-lg font-semibold mb-4 text-center">
                {solicitacoesGrafico === 0
                  ? "Solicitações criadas por mês"
                  : "Distribuição por Status"}
              </h3>

              {/* Gráfico ativo */}
              {solicitacoesGrafico === 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={solicitacoes.historicoMensal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="qtd" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Novas", value: solicitacoes.novas },
                        { name: "Em andamento", value: solicitacoes.andamento },
                        { name: "Concluídas", value: solicitacoes.concluido },
                        { name: "Canceladas", value: solicitacoes.cancelado },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      <Cell fill="#6366F1" /> {/* Novas */}
                      <Cell fill="#F59E0B" /> {/* Em andamento */}
                      <Cell fill="#10B981" /> {/* Concluídas */}
                      <Cell fill="#EF4444" /> {/* Canceladas */}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {/* Botões de navegação */}
              <button
                onClick={() =>
                  setSolicitacoesGrafico((prev) =>
                    prev === 0 ? 1 : 0
                  )
                }
                className="absolute -left-5 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-3 py-1 rounded-full shadow hover:scale-110 hover:-left-7 hover:cursor-pointer transition-all"
              >
                <IoMdArrowDropleft size={20} />
              </button>
              <button
                onClick={() =>
                  setSolicitacoesGrafico((prev) =>
                    prev === 1 ? 0 : 1
                  )
                }
                className="absolute -right-5 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-3 py-1 rounded-full shadow hover:scale-110 hover:-right-7 hover:cursor-pointer transition-all"
              >
                <IoMdArrowDropright size={20} />
              </button>
            </div>
          </section>



        </div>
      </main>
    </div>
  );
}

function Card({ icon, label, value, highlight, totais, time }) {
  return (
    <div
      className={`p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center ${highlight
        ? "bg-purple-600 text-white col-span-6"
        : "bg-gray-50 text-gray-800 col-span-2"
        } ${totais ? "col-span-6" : ""} ${time ? "col-span-3" : ""}
        
        
        `

      }
    >
      <div
        className={`text-3xl mb-2 ${highlight ? "text-white" : "text-purple-600"
          }`}
      >
        {icon}
      </div>
      <p className="text-sm">{label}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
