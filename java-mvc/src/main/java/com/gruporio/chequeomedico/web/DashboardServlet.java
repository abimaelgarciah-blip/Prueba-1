package com.gruporio.chequeomedico.web;

import com.gruporio.chequeomedico.dao.MedicalRecordDao;
import com.gruporio.chequeomedico.model.MedicalRecord;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.time.YearMonth;
import java.util.*;

/** Equivalente a view-dashboard.js: estadisticas + datos para las graficas Chart.js. */
@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {

    private final MedicalRecordDao dao = new MedicalRecordDao();
    private final Gson gson = new Gson();

    private static final Map<String, String[]> RESULT_FIELDS_BY_SYSTEM = buildResultFields();

    private static Map<String, String[]> buildResultFields() {
        Map<String, String[]> m = new LinkedHashMap<>();
        m.put("Respiratorio", new String[]{"c7-resp-rx", "c7-resp-espiro"});
        m.put("Cardiovascular", new String[]{"c13-resultado"});
        m.put("Gastrointestinal", new String[]{"c7-gi-eco", "c7-gi-pfh", "c7-gi-copro"});
        m.put("Genitourinario", new String[]{"c7-gu-ecoR", "c19-resultado"});
        m.put("Endocrino", new String[]{"c7-endo-gluc", "c7-endo-colT", "c7-endo-au"});
        m.put("Musculoesquelético", new String[]{"c7-muscu-rx", "c7-muscu-densi"});
        m.put("Hematopoyético", new String[]{"c7-hema-bh"});
        m.put("Nervioso", new String[]{"c7-nerv-oftal", "c7-nerv-audio", "c24-resultado"});
        return m;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            String clinicFilter = req.getParameter("clinic");
            List<MedicalRecord> all = dao.findAll();
            List<MedicalRecord> records = (clinicFilter == null || clinicFilter.isEmpty())
                    ? all
                    : all.stream().filter(r -> clinicFilter.equals(r.getClinic())).collect(java.util.stream.Collectors.toList());

            long total = records.size();
            long masc = records.stream().filter(r -> "Masculino".equals(r.getSex())).count();
            long fem = records.stream().filter(r -> "Femenino".equals(r.getSex())).count();
            Set<String> clinics = new TreeSet<>();
            all.forEach(r -> { if (r.getClinic() != null && !r.getClinic().isEmpty()) clinics.add(r.getClinic()); });
            YearMonth thisMonth = YearMonth.now();
            long thisMonthCount = records.stream()
                    .filter(r -> r.getUpdatedAt() != null && YearMonth.from(r.getUpdatedAt()).equals(thisMonth))
                    .count();

            Map<String, Long> abnormalBySystem = new LinkedHashMap<>();
            for (Map.Entry<String, String[]> e : RESULT_FIELDS_BY_SYSTEM.entrySet()) {
                long count = records.stream().filter(r -> hasAbnormal(r, e.getValue())).count();
                abnormalBySystem.put(e.getKey(), count);
            }

            Map<String, Long> monthTrend = new TreeMap<>();
            for (MedicalRecord r : records) {
                if (r.getUpdatedAt() == null) continue;
                String key = YearMonth.from(r.getUpdatedAt()).toString();
                monthTrend.merge(key, 1L, Long::sum);
            }

            req.setAttribute("total", total);
            req.setAttribute("masculino", masc);
            req.setAttribute("femenino", fem);
            req.setAttribute("clinicsCount", clinics.size());
            req.setAttribute("thisMonth", thisMonthCount);
            req.setAttribute("clinics", clinics);
            req.setAttribute("clinicFilter", clinicFilter);
            req.setAttribute("recent", records.stream().limit(10).collect(java.util.stream.Collectors.toList()));
            req.setAttribute("abnormalBySystemJson", gson.toJson(abnormalBySystem));
            req.setAttribute("monthTrendJson", gson.toJson(monthTrend));

            req.getRequestDispatcher("/WEB-INF/views/dashboard.jsp").forward(req, resp);
        } catch (SQLException e) {
            throw new ServletException("Error de base de datos", e);
        }
    }

    private boolean hasAbnormal(MedicalRecord r, String[] fields) {
        for (String f : fields) {
            String v = r.getData().get(f);
            if (v != null && v.toLowerCase().contains("anormal")) return true;
        }
        return false;
    }
}
