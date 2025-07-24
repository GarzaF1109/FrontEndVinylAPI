<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- Header con título y acciones -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold">Mi Colección de Vinilos</h1>
            <p class="text-subtitle-1 text-grey-darken-1 mt-1">
              {{ vinyls.length }} vinilo{{ vinyls.length !== 1 ? 's' : '' }} en tu colección
            </p>
          </div>
          <v-btn 
            color="primary" 
            size="large"
            prepend-icon="mdi-plus"
            @click="showAddDialog = true"
            elevation="2"
          >
            Agregar Vinilo
          </v-btn>
        </div>

        <!-- Estados de carga y error -->
        <v-card v-if="loading" class="text-center pa-8" elevation="2">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
          <p class="text-h6 mt-4">Cargando vinilos...</p>
        </v-card>

        <v-alert v-if="error" type="error" class="mb-4" variant="tonal">
          <template v-slot:prepend>
            <v-icon>mdi-alert-circle</v-icon>
          </template>
          {{ error }}
        </v-alert>

        <!-- Tabla de vinilos -->
        <v-card v-if="!loading" elevation="2">
          <v-card-title class="bg-grey-lighten-4">
            <v-icon class="mr-2">mdi-library-music</v-icon>
            Colección de Vinilos
          </v-card-title>
          
          <v-data-table
            v-if="vinyls.length"
            :headers="headers"
            :items="vinyls"
            :items-per-page="10"
            class="elevation-0"
            item-key="id"
          >
            <!-- Columna de nombre con icono -->
            <template v-slot:item.name="{ item }">
              <div class="d-flex align-center">
                <v-icon class="mr-3" color="primary">mdi-album</v-icon>
                <div>
                  <div class="font-weight-medium">{{ item.name }}</div>
                </div>
              </div>
            </template>

            <!-- Columna de artista -->
            <template v-slot:item.artist="{ item }">
              <span class="text-grey-darken-2">
                {{ item.artist || 'No especificado' }}
              </span>
            </template>

            <!-- Columna de año -->
            <template v-slot:item.year="{ item }">
              <v-chip 
                v-if="item.year" 
                color="primary" 
                variant="outlined" 
                size="small"
              >
                {{ item.year }}
              </v-chip>
              <span v-else class="text-grey">-</span>
            </template>

            <!-- Columna de acciones -->
            <template v-slot:item.actions="{ item }">
              <div class="d-flex gap-2">
                <v-btn
                  color="primary"
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-pencil"
                  @click="editVinyl(item)"
                >
                  Editar
                </v-btn>
                <v-btn
                  color="error"
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-delete"
                  @click="confirmDelete(item)"
                >
                  Eliminar
                </v-btn>
              </div>
            </template>

            <!-- Pie de tabla personalizado -->
            <template v-slot:bottom>
              <div class="text-center pa-4">
                <v-pagination
                  v-model="page"
                  :length="Math.ceil(vinyls.length / itemsPerPage)"
                  total-visible="7"
                ></v-pagination>
              </div>
            </template>
          </v-data-table>

          <!-- Estado vacío mejorado -->
          <div v-else class="text-center pa-12">
            <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-library-music-outline</v-icon>
            <h3 class="text-h5 mb-2">No hay vinilos en tu colección</h3>
            <p class="text-body-1 text-grey-darken-1 mb-4">
              ¡Comienza agregando tu primer vinilo a la colección!
            </p>
            <v-btn 
              color="primary" 
              size="large"
              prepend-icon="mdi-plus"
              @click="showAddDialog = true"
            >
              Agregar Primer Vinilo
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para agregar/editar vinilo mejorado -->
    <v-dialog v-model="showAddDialog" max-width="600px" persistent>
      <v-card elevation="8">
        <v-card-title class="bg-primary text-white">
          <v-icon class="mr-2">{{ editingVinyl ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          {{ editingVinyl ? 'Editar Vinilo' : 'Agregar Nuevo Vinilo' }}
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-form ref="form" v-model="formValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.name"
                  label="Nombre del álbum"
                  :rules="nameRules"
                  required
                  prepend-inner-icon="mdi-album"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-text-field
                  v-model="formData.artist"
                  label="Artista"
                  prepend-inner-icon="mdi-account-music"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-text-field
                  v-model.number="formData.year"
                  label="Año de lanzamiento"
                  type="number"
                  min="1900"
                  :max="new Date().getFullYear()"
                  prepend-inner-icon="mdi-calendar"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn 
            variant="outlined"
            @click="closeDialog"
            :disabled="saving"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="primary" 
            @click="saveVinyl"
            :disabled="!formValid"
            :loading="saving"
            prepend-icon="mdi-content-save"
          >
            {{ editingVinyl ? 'Actualizar' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Confirmar Eliminación
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar "<strong>{{ vinylToDelete?.name }}</strong>" de tu colección?
          <br><br>
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="showDeleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn 
            color="error" 
            @click="deleteVinyl"
            :loading="deleting"
            prepend-icon="mdi-delete"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import vinylApi from '@/services/vinylApi'

export default {
  name: 'VinylList',
  data() {
    return {
      vinyls: [],
      loading: false,
      error: null,
      showAddDialog: false,
      showDeleteDialog: false,
      editingVinyl: null,
      vinylToDelete: null,
      saving: false,
      deleting: false,
      formValid: false,
      page: 1,
      itemsPerPage: 10,
      formData: {
        name: '',
        artist: '',
        year: null
      },
      nameRules: [
        v => !!v || 'El nombre es obligatorio',
        v => (v && v.length >= 2) || 'El nombre debe tener al menos 2 caracteres'
      ],
      headers: [
        {
          title: 'Álbum',
          align: 'start',
          sortable: true,
          key: 'name',
        },
        {
          title: 'Artista',
          align: 'start',
          sortable: true,
          key: 'artist',
        },
        {
          title: 'Año',
          align: 'center',
          sortable: true,
          key: 'year',
        },
        {
          title: 'Acciones',
          align: 'center',
          sortable: false,
          key: 'actions',
        },
      ]
    }
  },
  async mounted() {
    await this.loadVinyls()
  },
  methods: {
    async loadVinyls() {
      this.loading = true
      this.error = null
      try {
        this.vinyls = await vinylApi.getAllVinyls()
      } catch (error) {
        this.error = 'Error cargando los vinilos. Verifica que el backend esté ejecutándose.'
      } finally {
        this.loading = false
      }
    },

    async saveVinyl() {
      if (!this.formValid) return

      this.saving = true
      try {
        if (this.editingVinyl) {
          await vinylApi.updateVinyl(this.editingVinyl.id, this.formData)
        } else {
          await vinylApi.createVinyl(this.formData)
        }
        
        await this.loadVinyls()
        this.closeDialog()
        
        // Mostrar mensaje de éxito (opcional, requiere Vuetify snackbar)
        // this.$emit('show-success', `Vinilo ${this.editingVinyl ? 'actualizado' : 'agregado'} exitosamente`)
      } catch (error) {
        this.error = `Error ${this.editingVinyl ? 'actualizando' : 'guardando'} el vinilo`
      } finally {
        this.saving = false
      }
    },

    editVinyl(vinyl) {
      this.editingVinyl = vinyl
      this.formData = {
        name: vinyl.name,
        artist: vinyl.artist || '',
        year: vinyl.year
      }
      this.showAddDialog = true
    },

    confirmDelete(vinyl) {
      this.vinylToDelete = vinyl
      this.showDeleteDialog = true
    },

    async deleteVinyl() {
      if (!this.vinylToDelete) return

      this.deleting = true
      try {
        await vinylApi.deleteVinyl(this.vinylToDelete.id)
        await this.loadVinyls()
        this.showDeleteDialog = false
        this.vinylToDelete = null
      } catch (error) {
        this.error = 'Error eliminando el vinilo'
      } finally {
        this.deleting = false
      }
    },

    closeDialog() {
      this.showAddDialog = false
      this.editingVinyl = null
      this.formData = {
        name: '',
        artist: '',
        year: null
      }
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
    }
  }
}
</script>