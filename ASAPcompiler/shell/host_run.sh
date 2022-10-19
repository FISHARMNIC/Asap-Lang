# run on host pc

cd ../
node ASAPmain
cd shell
limactl shell debian
qemu-system-x86_64 -cdrom /tmp/lima/bin/MyOS.iso